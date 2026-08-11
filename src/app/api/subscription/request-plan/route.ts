import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { saveUser, getUserById } from '@/lib/job-store';
import { SubscriptionTier } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { targetTier } = await req.json();
    const validTiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'custom'];

    if (!validTiers.includes(targetTier)) {
      return NextResponse.json({ success: false, error: 'Invalid subscription tier selected.' }, { status: 400 });
    }

    const fullUser = getUserById(user.id);
    if (!fullUser) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    fullUser.requestedTier = targetTier;
    fullUser.planStatus = 'approval_pending';
    saveUser(fullUser);

    return NextResponse.json({
      success: true,
      message: `Plan upgrade request for ${targetTier.toUpperCase()} plan submitted! Sent to Admin approval queue.`,
      user: {
        id: fullUser.id,
        tier: fullUser.tier,
        planStatus: fullUser.planStatus,
        requestedTier: fullUser.requestedTier,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Plan request failed';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
