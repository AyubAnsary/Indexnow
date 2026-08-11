import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getUserGoogleCredentials } from '@/lib/job-store';
import { initCronScheduler } from '@/lib/cron-scheduler';

export async function GET(req: Request) {
  try {
    // Launch Autonomous Background Cron Daemon
    initCronScheduler();

    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const hasGoogleCreds = !!getUserGoogleCredentials(user.id);

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tier: user.tier,
        planStatus: user.planStatus,
        requestedTier: user.requestedTier,
        monthlyQuota: user.monthlyQuota,
        urlsUsedThisMonth: user.urlsUsedThisMonth,
        remainingQuota: Math.max(0, user.monthlyQuota - user.urlsUsedThisMonth),
        hasGoogleCreds,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Auth verification error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
