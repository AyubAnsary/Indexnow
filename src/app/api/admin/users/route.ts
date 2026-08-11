import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAllUsers } from '@/lib/job-store';

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    const users = getAllUsers().map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      tier: u.tier,
      planStatus: u.planStatus,
      requestedTier: u.requestedTier,
      monthlyQuota: u.monthlyQuota,
      urlsUsedThisMonth: u.urlsUsedThisMonth,
      customPriceAmount: u.customPriceAmount,
      createdAt: u.createdAt,
      hasGoogleCreds: !!u.googleServiceAccountEncrypted,
    }));

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch admin users list';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
