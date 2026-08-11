import { NextResponse } from 'next/server';
import { validateApiKey, checkAndDeductQuota, saveJob, addJobLog, getUserGoogleCredentials } from '@/lib/job-store';
import { parseRawUrlInput, extractDomain, isSitemapUrl, parseSitemapXml } from '@/lib/url-validator';
import { isSsrfSafeUrl } from '@/lib/security';
import { submitToIndexNow, generateIndexNowKey, groupUrlsByHost } from '@/lib/indexnow-driver';
import { sendCrawlPing } from '@/lib/google-ping-driver';
import { submitToGoogleIndexingApi } from '@/lib/google-indexing-driver';
import { EngineType, IndexingJob, UrlSubmissionItem } from '@/lib/types';

export async function POST(req: Request) {
  // 1. Authenticate API Key via Authorization Bearer Header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized. Please provide a valid API key via Authorization: Bearer sk_silverstone_...' },
      { status: 401 }
    );
  }

  const rawKey = authHeader.replace('Bearer ', '').trim();
  const authenticatedUser = validateApiKey(rawKey);

  if (!authenticatedUser) {
    return NextResponse.json(
      { error: 'Invalid or revoked API key.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { urls, engines = ['indexnow', 'ping'] } = body;

    if (!urls || (!Array.isArray(urls) && typeof urls !== 'string')) {
      return NextResponse.json(
        { error: 'Invalid payload. Provide an array of URLs or a raw URL string.' },
        { status: 400 }
      );
    }

    const rawInput = Array.isArray(urls) ? urls.join('\n') : urls;
    let parsedUrls: string[] = [];

    if (isSitemapUrl(rawInput)) {
      parsedUrls = await parseSitemapXml(rawInput.trim());
      if (parsedUrls.length === 0) parsedUrls = parseRawUrlInput(rawInput);
    } else {
      parsedUrls = parseRawUrlInput(rawInput);
    }

    if (parsedUrls.length === 0) {
      return NextResponse.json({ error: 'No valid HTTP/HTTPS URLs detected.' }, { status: 400 });
    }

    // SSRF Security Check
    for (const urlStr of parsedUrls) {
      const ssrf = isSsrfSafeUrl(urlStr);
      if (!ssrf.safe) {
        return NextResponse.json({ error: `URL prohibited by SSRF security rules: ${urlStr}` }, { status: 400 });
      }
    }

    // Quota Check
    const quotaCheck = checkAndDeductQuota(authenticatedUser.id, parsedUrls.length);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.errorMsg, upgradeRequired: true },
        { status: 402 }
      );
    }

    // Create Job
    const jobId = 'job_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const hostKey = generateIndexNowKey();
    const selectedEngines: EngineType[] = Array.isArray(engines) ? engines : ['indexnow', 'ping'];

    const initialUrls: UrlSubmissionItem[] = parsedUrls.map((url, idx) => ({
      id: `${jobId}_${idx}`,
      url,
      domain: extractDomain(url),
      status: 'pending',
      engineResults: [],
    }));

    const newJob: IndexingJob = {
      id: jobId,
      userId: authenticatedUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalUrls: parsedUrls.length,
      processedCount: 0,
      successCount: 0,
      failedCount: 0,
      status: 'queued',
      enginesSelected: selectedEngines,
      urls: initialUrls,
      logs: [
        {
          id: 'log_1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Public Developer REST API job initialized for ${authenticatedUser.email} (${parsedUrls.length} URLs).`,
        },
      ],
      keyUsed: hostKey,
    };

    saveJob(newJob);

    // Async Processing
    (async () => {
      try {
        if (selectedEngines.includes('indexnow')) {
          const urlsByHost = groupUrlsByHost(parsedUrls);
          for (const [host, hostUrls] of Object.entries(urlsByHost)) {
            await submitToIndexNow(host, hostUrls, { hostKey });
          }
        }
        if (selectedEngines.includes('ping')) {
          await sendCrawlPing(parsedUrls[0]);
        }
        if (selectedEngines.includes('google_api')) {
          const googleCreds = getUserGoogleCredentials(authenticatedUser.id);
          if (googleCreds) {
            for (const targetUrl of parsedUrls) {
              await submitToGoogleIndexingApi(targetUrl, googleCreds);
            }
          }
        }
      } catch (err) {
        console.error('Developer API background execution error:', err);
      }
    })();

    return NextResponse.json({
      success: true,
      message: `REST API job initialized successfully! ${parsedUrls.length} URLs accepted.`,
      jobId: newJob.id,
      submittedUrlsCount: parsedUrls.length,
      quotaRemaining: quotaCheck.remaining,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Developer API processing failed.' }, { status: 500 });
  }
}
