import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkAndDeductQuota, saveJob } from '@/lib/job-store';
import { generateIndexNowKey } from '@/lib/indexnow-driver';
import { IndexingJob, UrlSubmissionItem } from '@/lib/types';
import { extractDomain } from '@/lib/url-validator';

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { unindexedUrls, dailyRate } = await req.json();

    if (!Array.isArray(unindexedUrls) || unindexedUrls.length === 0) {
      return NextResponse.json({ error: 'No unindexed URLs provided for automated drip plan.' }, { status: 400 });
    }

    const quotaCheck = checkAndDeductQuota(user.id, unindexedUrls.length);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.errorMsg, upgradeRequired: true },
        { status: 402 }
      );
    }

    const jobId = 'job_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const hostKey = generateIndexNowKey();
    const dailyLimit = Number(dailyRate) || 50;

    const initialUrls: UrlSubmissionItem[] = unindexedUrls.map((url, idx) => ({
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
      totalUrls: unindexedUrls.length,
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
          message: `[Zero-Touch Auto-Pilot] Drip-feed plan activated for ${unindexedUrls.length} URLs at ${dailyLimit} URLs/day.`,
        },
      ],
      keyUsed: hostKey,
      dripConfig: {
        isDrip: true,
        dailyLimit,
        startDate: new Date().toISOString(),
        queuedUrls: [...unindexedUrls],
        processedBatchesCount: 0,
      },
    };

    saveJob(newJob);

    return NextResponse.json({
      success: true,
      message: `Zero-Touch Auto-Pilot activated! ${unindexedUrls.length} URLs enrolled in daily drip indexer.`,
      jobId: newJob.id,
      dailyRate: dailyLimit,
      remainingQuota: quotaCheck.remaining,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Auto-plan activation failed.' }, { status: 500 });
  }
}
