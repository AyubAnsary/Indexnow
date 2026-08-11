import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getSitemapMonitors, getUserById, checkAndDeductQuota, saveJob, addJobLog } from '@/lib/job-store';
import { parseSitemapXml, extractDomain } from '@/lib/url-validator';
import { submitToIndexNow, generateIndexNowKey } from '@/lib/indexnow-driver';
import { sendCrawlPing } from '@/lib/google-ping-driver';
import { IndexingJob, UrlSubmissionItem } from '@/lib/types';

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { monitorId } = await req.json();
    const monitors = getSitemapMonitors(user.id);
    const targetMonitor = monitors.find((m) => m.id === monitorId);

    if (!targetMonitor) {
      return NextResponse.json({ error: 'Sitemap monitor not found.' }, { status: 404 });
    }

    // 1. Fetch & Parse Sitemap XML
    const discovered = await parseSitemapXml(targetMonitor.sitemapUrl);
    if (discovered.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Sync completed. No URLs discovered in sitemap.',
        discoveredCount: 0,
      });
    }

    // 2. Check User Quota
    const currentAccount = getUserById(user.id);
    if (!currentAccount) return NextResponse.json({ error: 'User account not found' }, { status: 404 });

    const quotaCheck = checkAndDeductQuota(user.id, discovered.length);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.errorMsg, upgradeRequired: true },
        { status: 402 }
      );
    }

    // 3. Create Indexing Job
    const jobId = 'job_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const hostKey = generateIndexNowKey();

    const initialUrls: UrlSubmissionItem[] = discovered.map((url, idx) => ({
      id: `${jobId}_${idx}`,
      url,
      domain: extractDomain(url),
      status: 'pending',
      engineResults: [],
    }));

    const newJob: IndexingJob = {
      id: jobId,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalUrls: discovered.length,
      processedCount: 0,
      successCount: 0,
      failedCount: 0,
      status: 'queued',
      enginesSelected: ['indexnow', 'ping'],
      urls: initialUrls,
      logs: [
        {
          id: 'log_1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Auto-Sitemap Sync triggered for ${targetMonitor.sitemapUrl} (${discovered.length} URLs).`,
        },
      ],
      keyUsed: hostKey,
    };

    saveJob(newJob);

    // 4. Asynchronous Background Broadcast
    (async () => {
      try {
        await submitToIndexNow(targetMonitor.domain, discovered, { hostKey });
        await sendCrawlPing(discovered[0] || targetMonitor.sitemapUrl);
      } catch (err) {
        console.error('Background sitemap sync error:', err);
      }
    })();

    targetMonitor.lastCheckedAt = new Date().toISOString();
    targetMonitor.lastUrlCount = discovered.length;
    targetMonitor.discoveredUrlsCount += discovered.length;

    return NextResponse.json({
      success: true,
      message: `Sitemap sync complete! ${discovered.length} URLs dispatched for instant indexing.`,
      jobId: newJob.id,
      discoveredCount: discovered.length,
      submittedCount: discovered.length,
      remainingQuota: quotaCheck.remaining,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sitemap sync failed.' }, { status: 500 });
  }
}
