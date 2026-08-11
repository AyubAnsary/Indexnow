import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { grantCustomQuota, getUserById } from '@/lib/job-store';

export async function POST(req: Request) {
  try {
    const adminUser = await getAuthenticatedUser(req);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    const { targetUserId, customQuota, customPrice } = await req.json();

    const numericQuota = parseInt(customQuota, 10);
    const numericPrice = customPrice !== undefined ? parseFloat(customPrice) : undefined;

    if (isNaN(numericQuota) || numericQuota < 1) {
      return NextResponse.json({ success: false, error: 'Please enter a valid URL quota number.' }, { status: 400 });
    }

    const targetUser = getUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Target user account not found.' }, { status: 404 });
    }

    grantCustomQuota(targetUserId, numericQuota, numericPrice);

    return NextResponse.json({
      success: true,
      message: `Granted ${numericQuota.toLocaleString()} monthly URLs to ${targetUser.email} for ${
        numericPrice !== undefined ? '$' + numericPrice : 'custom pricing'
      }.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Grant custom quota failed';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
