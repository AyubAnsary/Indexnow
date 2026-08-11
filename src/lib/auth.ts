import { cookies } from 'next/headers';
import { verifyJwtToken } from './security';
import { getUserById } from './job-store';
import { UserAccount } from './types';
import { generateDeviceFingerprint } from './device-lock';

export const SESSION_COOKIE_NAME = 'indexpulse_session';

/**
 * Extracts and verifies the authenticated user from cookies or Authorization header.
 * Enforces Anti-Group Buy Device Lock & Cookie Sharing Protection.
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
  if (!user) return null;

  // Anti-Group Buy Lock Check 1: Single Active Device Session Validation
  if (user.activeSessionId && payload.sessionId && user.activeSessionId !== payload.sessionId) {
    console.warn(`[Anti-Group Buy] Session invalidated for ${user.email}: Account logged in from another device.`);
    return null;
  }

  // Anti-Group Buy Lock Check 2: Device Fingerprint & IP Subnet Validation
  if (req && user.activeFingerprint) {
    const currentFingerprint = generateDeviceFingerprint(req);
    if (user.activeFingerprint !== currentFingerprint) {
      console.warn(`[Anti-Group Buy] Cookie sharing detected for ${user.email}: Request fingerprint mismatch.`);
      return null;
    }
  }

  return user;
}
