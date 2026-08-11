import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { approveUserPlan, getUserById, saveUser } from '@/lib/job-store';

export async function POST(req: Request) {
  try {
    const adminUser = await getAuthenticatedUser(req);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    const { targetUserId, action } = await req.json(); // action: 'approve' | 'reject'

    const targetUser = getUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Target user account not found.' }, { status: 404 });
    }

    if (action === 'approve') {
      const newTier = targetUser.requestedTier || 'starter';
      approveUserPlan(targetUserId, newTier);

      return NextResponse.json({
        success: true,
        message: `Successfully approved ${targetUser.email} for ${newTier.toUpperCase()} plan!`,
      });
    } else {
      targetUser.planStatus = 'active';
      targetUser.requestedTier = undefined;
      saveUser(targetUser);

      return NextResponse.json({
        success: true,
        message: `Plan request for ${targetUser.email} rejected. Kept on current plan.`,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Admin action failed';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
