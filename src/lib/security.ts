import crypto from 'crypto';

// Secret key for AES-256-GCM encryption (fallback to internal secret if env not set)
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'indexpulse-super-secret-encryption-key-32b!';
const JWT_SECRET = process.env.JWT_SECRET || 'indexpulse-jwt-secret-key-signature-2026';

/**
 * SSRF (Server-Side Request Forgery) URL Protection.
 * Validates that an input URL is a public web address and not an internal/private network IP.
 */
export function isSsrfSafeUrl(urlString: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(urlString.trim());
    const hostname = parsed.hostname.toLowerCase();

    // Block non-HTTP protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Only HTTP and HTTPS protocols are permitted.' };
    }

    // Block localhost, loopback, and local network domains
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.lan') ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1'
    ) {
      return { safe: false, reason: 'Localhost and internal loopback addresses are prohibited.' };
    }

    // Block Cloud Provider Metadata APIs (AWS/GCP/Azure metadata 169.254.169.254)
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
      return { safe: false, reason: 'Cloud metadata service access is prohibited.' };
    }

    // Block private RFC 1918 IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
    const ipMatch = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname);
    if (ipMatch) {
      const octet1 = parseInt(ipMatch[1], 10);
      const octet2 = parseInt(ipMatch[2], 10);

      if (
        octet1 === 10 ||
        (octet1 === 172 && octet2 >= 16 && octet2 <= 31) ||
        (octet1 === 192 && octet2 === 168) ||
        octet1 === 127 ||
        octet1 === 0
      ) {
        return { safe: false, reason: 'Private IP network addresses are prohibited.' };
      }
    }

    return { safe: true };
  } catch {
    return { safe: false, reason: 'Invalid URL format.' };
  }
}

/**
 * Hashes a password using PBKDF2 with a random 16-byte salt.
 */
export function hashPassword(password: string, saltInput?: string): { hash: string; salt: string } {
  const salt = saltInput || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verifies a password against a stored hash and salt.
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computed));
}

/**
 * Encrypts sensitive credentials (like Google Service Account JSON keys) using AES-256-GCM.
 */
export function encryptData(text: string): string {
  const key = crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts sensitive AES-256-GCM encrypted data.
 */
export function decryptData(encryptedStr: string): string {
  try {
    const [ivHex, authTagHex, encryptedTextHex] = encryptedStr.split(':');
    if (!ivHex || !authTagHex || !encryptedTextHex) return '';

    const key = crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedTextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption failed:', err);
    return '';
  }
}

/**
 * Signs a lightweight JWT session token with Anti-Group Buy Device Lock.
 */
export function signJwtToken(payload: {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
  fingerprint?: string;
}): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 3600; // 30 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies and decodes a JWT session token.
 */
export function verifyJwtToken(token: string): {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
  fingerprint?: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) return null;

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      sessionId: decoded.sessionId,
      fingerprint: decoded.fingerprint,
    };
  } catch {
    return null;
  }
}
