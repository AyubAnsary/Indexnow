import { NextResponse } from 'next/server';
import { EngineType, IndexingJob, UrlSubmissionItem } from '@/lib/types';
import {
  isSitemapUrl,
  parseRawUrlInput,
  parseSitemapXml,
  preflightCheckUrl,
  extractDomain,
} from '@/lib/url-validator';
import {
  generateIndexNowKey,
  groupUrlsByHost,
  submitToIndexNow,
} from '@/lib/indexnow-driver';
import { sendCrawlPing } from '@/lib/google-ping-driver';
import { submitToGoogleIndexingApi } from '@/lib/google-indexing-driver';
import {
  addJobLog,
  getUserCredentials,
  saveJob,
} from '@/lib/job-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rawInput, engines = ['indexnow', 'ping'], options = {} } = body;

    if (!rawInput || typeof rawInput !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide valid URL(s) or a sitemap link.' },
        { status: 400 }
      );
    }

    let urlsToProcess: string[] = [];

    // Check if input is a sitemap URL
    if (isSitemapUrl(rawInput)) {
      urlsToProcess = await parseSitemapXml(rawInput.trim());
      if (urlsToProcess.length === 0) {
        // Fallback to treat input itself as single URL if sitemap parsing returns empty
        urlsToProcess = parseRawUrlInput(rawInput);
      }
    } else {
      urlsToProcess = parseRawUrlInput(rawInput);
    }

    if (urlsToProcess.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid HTTP/HTTPS URLs were found in your input.' },
        { status: 400 }
      );
    }

    const jobId = 'job_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const hostKey = options.hostKey || generateIndexNowKey();

    const initialUrls: UrlSubmissionItem[] = urlsToProcess.map((url, idx) => ({
      id: `${jobId}_${idx}`,
      url,
      domain: extractDomain(url),
      status: 'pending',
      engineResults: [],
    }));

    const newJob: IndexingJob = {
      id: jobId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalUrls: urlsToProcess.length,
      processedCount: 0,
      successCount: 0,
      failedCount: 0,
      status: 'queued',
      enginesSelected: engines,
      urls: initialUrls,
      logs: [
        {
          id: 'log_1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Job initialized with ${urlsToProcess.length} target URL(s).`,
        },
      ],
      keyUsed: hostKey,
    };

    const origin = new URL(req.url).origin;

    // Save job state initially
    saveJob(newJob);

    // Run processing asynchronously in background worker process
    processJobAsync(jobId, engines, { ...options, appBaseUrl: origin }, hostKey).catch((err) => {
      console.error(`Error processing job ${jobId}:`, err);
    });

    return NextResponse.json({
      success: true,
      jobId,
      message: `Job successfully created for ${urlsToProcess.length} URL(s).`,
      job: newJob,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error processing request';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

/**
 * Asynchronous job processor that executes submission pipeline across all selected engines
 */
async function processJobAsync(
  jobId: string,
  engines: EngineType[],
  options: { performPreflight?: boolean; appBaseUrl?: string },
  hostKey: string
) {
  const credentials = getUserCredentials();
  
  // 1. Update job state to validating/submitting
  addJobLog(jobId, {
    level: 'info',
    message: `Starting execution for engines: ${engines.join(', ').toUpperCase()}`,
  });

  // Fetch job state
  const jobStoreModule = await import('@/lib/job-store');
  const job = jobStoreModule.getJobById(jobId);
  if (!job) return;

  job.status = 'submitting';
  jobStoreModule.saveJob(job);

  // Group URLs by domain for IndexNow
  const urlsByHost = groupUrlsByHost(job.urls.map((u) => u.url));

  // Step A: Perform pre-flight HTTP verification if requested
  if (options.performPreflight) {
    addJobLog(jobId, {
      level: 'info',
      message: 'Running pre-flight HTTP verification checks on URLs...',
    });

    for (const item of job.urls) {
      item.status = 'checking_http';
      jobStoreModule.saveJob(job);

      const preflight = await preflightCheckUrl(item.url);
      item.httpStatus = preflight.statusCode;
      item.httpStatusText = preflight.statusText;

      addJobLog(jobId, {
        level: preflight.isOk ? 'info' : 'warning',
        message: `Pre-flight ${item.url} -> HTTP ${preflight.statusCode} (${preflight.statusText})`,
      });
    }
  }

  // Step B: IndexNow Engine Dispatch
  if (engines.includes('indexnow')) {
    addJobLog(jobId, {
      level: 'info',
      engine: 'indexnow',
      message: `Broadcasting URLs via Engine-Managed Key Proxy (Host Key: ${hostKey})...`,
    });

    for (const [host, hostUrls] of Object.entries(urlsByHost)) {
      addJobLog(jobId, {
        level: 'info',
        engine: 'indexnow',
        message: `Submitting batch of ${hostUrls.length} URL(s) for domain ${host}...`,
      });

      const results = await submitToIndexNow(host, hostUrls, {
        hostKey,
        appBaseUrl: options.appBaseUrl,
      });

      for (const res of results) {
        addJobLog(jobId, {
          level: res.success ? 'success' : 'error',
          engine: 'indexnow',
          message: `[${res.endpoint}] ${res.message}`,
        });
      }

      // Update URL statuses
      for (const item of job.urls) {
        if (extractDomain(item.url) === host) {
          item.engineResults.push(...results);
          const anySuccess = results.some((r) => r.success);
          if (anySuccess) {
            item.status = 'indexnow_success';
            item.submittedAt = new Date().toISOString();
          }
        }
      }
    }
  }

  // Step C: Global Crawl Ping Engine Dispatch
  if (engines.includes('ping')) {
    addJobLog(jobId, {
      level: 'info',
      engine: 'ping',
      message: 'Notifying Google & Bing sitemap ping crawler endpoints...',
    });

    const primaryUrlOrHost = job.urls[0]?.url || 'https://example.com';
    const pingResults = await sendCrawlPing(primaryUrlOrHost);

    for (const res of pingResults) {
      addJobLog(jobId, {
        level: res.success ? 'success' : 'error',
        engine: 'ping',
        message: `[${res.endpoint}] ${res.message}`,
      });
    }

    for (const item of job.urls) {
      item.engineResults.push(...pingResults);
      if (item.status === 'pending') {
        item.status = 'ping_success';
      }
    }
  }

  // Step D: Google Direct Indexing API Dispatch (Optional)
  if (engines.includes('google_api')) {
    if (!credentials.googleServiceAccount) {
      addJobLog(jobId, {
        level: 'warning',
        engine: 'google_api',
        message: 'Google Indexing API selected, but no Google Service Account key was configured.',
      });
    } else {
      addJobLog(jobId, {
        level: 'info',
        engine: 'google_api',
        message: 'Authenticating with Google Cloud Service Account and pushing URLs...',
      });

      for (const item of job.urls) {
        const res = await submitToGoogleIndexingApi(item.url, credentials.googleServiceAccount);
        item.engineResults.push(res);

        addJobLog(jobId, {
          level: res.success ? 'success' : 'error',
          engine: 'google_api',
          message: `[Google Indexing API] ${item.url} -> ${res.message}`,
        });

        if (res.success) {
          item.status = 'google_success';
          item.submittedAt = new Date().toISOString();
        }
      }
    }
  }

  // Final job metric calculation
  let success = 0;
  let failed = 0;

  for (const item of job.urls) {
    const isOk = item.engineResults.some((r) => r.success);
    if (isOk) {
      success++;
      if (item.status === 'pending' || item.status === 'checking_http') {
        item.status = 'indexnow_success';
      }
    } else {
      failed++;
      item.status = 'failed';
    }
  }

  job.processedCount = job.urls.length;
  job.successCount = success;
  job.failedCount = failed;
  job.status = failed === 0 ? 'success' : success > 0 ? 'partial' : 'failed';
  job.updatedAt = new Date().toISOString();

  addJobLog(jobId, {
    level: job.status === 'success' ? 'success' : 'warning',
    message: `Indexing Job Completed. Success: ${success}/${job.totalUrls} URLs (${Math.round(
      (success / job.totalUrls) * 100
    )}% pass rate).`,
  });

  jobStoreModule.saveJob(job);
}
