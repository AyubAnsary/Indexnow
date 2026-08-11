import crypto from 'crypto';

/**
 * Extracts Client IP address from request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Extracts User-Agent string from request headers
 */
export function getUserAgent(req: Request): string {
  return req.headers.get('user-agent') || 'unknown-browser';
}

/**
 * Generates a SHA-256 Device Fingerprint from Client IP + User-Agent
 */
export function generateDeviceFingerprint(req: Request): string {
  const ip = getClientIp(req);
  const ua = getUserAgent(req);

  return crypto
    .createHash('sha256')
    .update(`${ip}:${ua}`)
    .digest('hex');
}
