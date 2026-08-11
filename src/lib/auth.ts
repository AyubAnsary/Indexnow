import { cookies } from 'next/headers';
import { verifyJwtToken } from './security';
import { getUserById } from './job-store';
import { UserAccount } from './types';

export const SESSION_COOKIE_NAME = 'indexpulse_session';

/**
 * Extracts and verifies the authenticated user from cookies or Authorization header.
 */
export async function getAuthenticatedUser(req?: Request): Promise<UserAccount | null> {
  let token: string | undefined;

  // 1. Try reading from HttpOnly cookie
  try {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  } catch {
    // Cookie store read fail fallback
  }

  // 2. Try reading from Authorization Header (Bearer token)
  if (!token && req) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  const payload = verifyJwtToken(token);
  if (!payload) return null;

  const user = getUserById(payload.userId);
  return user || null;
}
