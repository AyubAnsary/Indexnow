import { getStoreData, saveJob, addJobLog } from './job-store';
import { submitToIndexNow, generateIndexNowKey } from './indexnow-driver';
import { sendCrawlPing } from './google-ping-driver';

/**
 * Drip-Feed Batch Processing Worker
 * Sweeps drip jobs, releases daily URL chunks, and dispatches them automatically.
 */
export async function processDripFeedBatches() {
  const store = getStoreData();
  const activeDripJobs = store.jobs.filter(
    (j) => j.dripConfig?.isDrip && j.dripConfig.queuedUrls.length > 0
  );

  for (const job of activeDripJobs) {
    if (!job.dripConfig) continue;

    const dailyBatch = job.dripConfig.queuedUrls.splice(0, job.dripConfig.dailyLimit);
    job.dripConfig.processedBatchesCount += 1;

    addJobLog(job.id, {
      level: 'info',
      message: `[Drip-Feed Scheduler] Processing Daily Batch #${job.dripConfig.processedBatchesCount} (${dailyBatch.length} URLs released). ${job.dripConfig.queuedUrls.length} URLs remaining in drip queue.`,
    });

    saveJob(job);

    // Asynchronous Dispatch
    const hostKey = job.keyUsed || generateIndexNowKey();
    if (job.enginesSelected.includes('indexnow')) {
      const host = new URL(dailyBatch[0]).hostname;
      submitToIndexNow(host, dailyBatch, { hostKey }).catch(() => {});
    }
    if (job.enginesSelected.includes('ping')) {
      sendCrawlPing(dailyBatch[0]).catch(() => {});
    }
  }
}
