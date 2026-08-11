import {
  getStoreData,
  saveJob,
  checkAndDeductQuota,
  addJobLog,
  getUserGoogleCredentials,
  getUserById,
} from './job-store';
import { parseSitemapXml, extractDomain } from './url-validator';
import { submitToIndexNow, generateIndexNowKey } from './indexnow-driver';
import { sendCrawlPing } from './google-ping-driver';
import { submitToGoogleIndexingApi } from './google-indexing-driver';
import { IndexingJob, UrlSubmissionItem } from './types';

const globalForCron = globalThis as unknown as {
  __silverstone_cron_timer__?: NodeJS.Timeout;
};

/**
 * Initializes the Autonomous Background Cron Daemon.
 * Runs every 5 minutes, checks all registered SitemapMonitors across all users,
 * discovers newly added URLs, and triggers hands-free indexing automatically!
 */
export function initCronScheduler() {
  if (globalForCron.__silverstone_cron_timer__) {
    return;
  }

  console.log('⚡ [SilverStone Cron Daemon] Autonomous 24/7 Sitemap Monitor Engine Initialized.');

  // Run initial check after 10 seconds, then repeat every 5 minutes
  setTimeout(() => {
    runAutonomousSitemapSync();
  }, 10000);

  globalForCron.__silverstone_cron_timer__ = setInterval(() => {
    runAutonomousSitemapSync();
  }, 5 * 60 * 1000);
}

/**
 * Sweeps all active sitemap monitors and processes due checks
 */
export async function runAutonomousSitemapSync() {
  try {
    const store = getStoreData();
    if (!Array.isArray(store.monitors) || store.monitors.length === 0) return;

    const now = Date.now();

    for (const monitor of store.monitors) {
      if (monitor.status !== 'active') continue;

      const lastCheckedMs = monitor.lastCheckedAt ? new Date(monitor.lastCheckedAt).getTime() : 0;
      const intervalMs = monitor.checkIntervalMinutes * 60 * 1000;

      // Check if monitor is due for a check
      if (now - lastCheckedMs >= intervalMs) {
        console.log(`[Cron Daemon] Checking sitemap for ${monitor.domain} (${monitor.sitemapUrl})...`);

        try {
          // 1. Fetch & Parse Sitemap XML
          const discovered = await parseSitemapXml(monitor.sitemapUrl);
          monitor.lastCheckedAt = new Date().toISOString();
          monitor.lastUrlCount = discovered.length;

          if (discovered.length === 0) {
            continue;
          }

          // 2. Check User Quota
          const userAccount = getUserById(monitor.userId);
          if (!userAccount) continue;

          const allowedCount = Math.min(
            discovered.length,
            userAccount.monthlyQuota - userAccount.urlsUsedThisMonth
          );

          if (allowedCount <= 0) {
            console.log(`[Cron Daemon] User ${userAccount.email} reached monthly quota limit.`);
            monitor.lastError = 'Monthly quota limit reached';
            continue;
          }

          const urlsToSubmit = discovered.slice(0, allowedCount);

          // 3. Deduct Quota
          checkAndDeductQuota(userAccount.id, urlsToSubmit.length);

          // 4. Create Job
          const jobId = 'job_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
          const hostKey = generateIndexNowKey();

          const initialUrls: UrlSubmissionItem[] = urlsToSubmit.map((url, idx) => ({
            id: `${jobId}_${idx}`,
            url,
            domain: extractDomain(url),
            status: 'pending',
            engineResults: [],
          }));

          const newJob: IndexingJob = {
            id: jobId,
            userId: userAccount.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalUrls: urlsToSubmit.length,
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
                message: `[Autonomous Cron Daemon] Auto-indexed ${urlsToSubmit.length} URLs from ${monitor.sitemapUrl}`,
              },
            ],
            keyUsed: hostKey,
          };

          saveJob(newJob);

          // 5. Asynchronous Engine Broadcast
          submitToIndexNow(monitor.domain, urlsToSubmit, { hostKey }).catch(() => {});
          sendCrawlPing(urlsToSubmit[0] || monitor.sitemapUrl).catch(() => {});

          const googleCreds = getUserGoogleCredentials(userAccount.id);
          if (googleCreds) {
            for (const targetUrl of urlsToSubmit) {
              submitToGoogleIndexingApi(targetUrl, googleCreds).catch(() => {});
            }
          }

          monitor.discoveredUrlsCount += urlsToSubmit.length;
          monitor.lastError = undefined;
        } catch (err: any) {
          console.error(`[Cron Daemon] Error processing sitemap ${monitor.sitemapUrl}:`, err);
          monitor.lastError = err.message || 'Sitemap parse error';
        }
      }
    }
  } catch (err) {
    console.error('[Cron Daemon] Sweep error:', err);
  }
}
