import { NextResponse } from 'next/server';
import { getUserByEmail, saveUser } from '@/lib/job-store';
import { verifyPassword, signJwtToken } from '@/lib/security';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { generateDeviceFingerprint, getClientIp } from '@/lib/device-lock';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    // Anti-Group Buy: Device Lock & Session Fingerprint Generation
    const fingerprint = generateDeviceFingerprint(req);
    const clientIp = getClientIp(req);
    const sessionId = 'sess_' + crypto.randomBytes(16).toString('hex');

    // Revoke any previous device session (Single Active Device Lock)
    user.activeSessionId = sessionId;
    user.activeFingerprint = fingerprint;
    user.lastIpAddress = clientIp;
    saveUser(user);

    // Issue Device-Locked JWT session token
    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      fingerprint,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tier: user.tier,
        planStatus: user.planStatus,
        monthlyQuota: user.monthlyQuota,
        urlsUsedThisMonth: user.urlsUsedThisMonth,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
