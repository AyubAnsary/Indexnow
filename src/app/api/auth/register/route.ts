import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/job-store';
import { hashPassword, signJwtToken } from '@/lib/security';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists.' }, { status: 400 });
    }

    const { hash, salt } = hashPassword(password);
    const newUser = createUser(email, name || email.split('@')[0], hash, salt);

    // Issue JWT session token
    const token = signJwtToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account registered successfully! Assigned Free Tier (10 URLs/month).',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        tier: newUser.tier,
        monthlyQuota: newUser.monthlyQuota,
        urlsUsedThisMonth: newUser.urlsUsedThisMonth,
      },
    });

    // Set HttpOnly Cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600, // 30 days
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
