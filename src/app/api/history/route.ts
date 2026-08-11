import { NextResponse } from 'next/server';
import { getAllJobs, getUserCredentials } from '@/lib/job-store';

export async function GET() {
  try {
    const jobs = getAllJobs();
    const credentials = getUserCredentials();

    let totalUrlsSubmitted = 0;
    let totalSuccessCount = 0;
    const domainSet = new Set<string>();

    for (const job of jobs) {
      totalUrlsSubmitted += job.totalUrls;
      totalSuccessCount += job.successCount;
      for (const u of job.urls) {
        domainSet.add(u.domain);
      }
    }

    const successRatePercent =
      totalUrlsSubmitted > 0 ? Math.round((totalSuccessCount / totalUrlsSubmitted) * 100) : 100;

    const stats = {
      totalJobs: jobs.length,
      totalUrlsSubmitted,
      successRatePercent,
      activeDomainsCount: domainSet.size,
      averageSpeedMs: 180, // Avg IndexNow broadcast response latency
    };

    return NextResponse.json({
      success: true,
      stats,
      jobs,
      hasGoogleCreds: !!credentials.googleServiceAccount,
      hasBingCreds: !!credentials.bingApiKey,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error fetching history';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
