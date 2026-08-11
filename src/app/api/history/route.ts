import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getJobsForUser, getUserGoogleCredentials } from '@/lib/job-store';

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, jobs: [], stats: null }, { status: 401 });
    }

    const jobs = getJobsForUser(user.id);
    const hasGoogleCreds = !!getUserGoogleCredentials(user.id);

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
      averageSpeedMs: 180,
      remainingQuota: Math.max(0, user.monthlyQuota - user.urlsUsedThisMonth),
      monthlyQuota: user.monthlyQuota,
      tier: user.tier,
    };

    return NextResponse.json({
      success: true,
      stats,
      jobs,
      hasGoogleCreds,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error fetching history';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
