import axios from 'axios';

/**
 * Validates whether a given string is a valid HTTP/HTTPS URL.
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extracts domain name from a URL (e.g. https://example.com/page -> example.com)
 */
export function extractDomain(urlString: string): string {
  try {
    const parsed = new URL(urlString.trim());
    return parsed.hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Normalizes URL string (trims, removes trailing slash if desired, ensures protocol)
 */
export function normalizeUrl(urlString: string): string {
  let cleaned = urlString.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  try {
    const parsed = new URL(cleaned);
    return parsed.href;
  } catch {
    return cleaned;
  }
}

/**
 * Parses raw text input containing URLs separated by newlines, commas, or spaces.
 * Deduplicates and returns an array of valid URLs.
 */
export function parseRawUrlInput(rawInput: string): string[] {
  if (!rawInput || typeof rawInput !== 'string') return [];

  // Split by newlines, commas, or spaces
  const candidates = rawInput.split(/[\r\n,\s]+/);
  const validSet = new Set<string>();

  for (const item of candidates) {
    const trimmed = item.trim();
    if (trimmed && isValidUrl(trimmed)) {
      validSet.add(normalizeUrl(trimmed));
    }
  }

  return Array.from(validSet);
}

/**
 * Checks if an input string is a URL ending in .xml or containing sitemap keyword.
 */
export function isSitemapUrl(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  return isValidUrl(trimmed) && (trimmed.endsWith('.xml') || trimmed.includes('sitemap'));
}

/**
 * Fetches an XML sitemap and extracts all <loc> URLs inside it.
 */
export async function parseSitemapXml(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await axios.get(sitemapUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'IndexNow-Universal-Indexer/1.0',
      },
    });

    const xmlContent = response.data;
    if (typeof xmlContent !== 'string') return [];

    // Simple regex parser for <loc> tags inside XML sitemaps
    const locRegex = /<loc>(.*?)<\/loc>/gi;
    const urls = new Set<string>();
    let match;

    while ((match = locRegex.exec(xmlContent)) !== null) {
      const extractedUrl = match[1]?.trim();
      if (extractedUrl && isValidUrl(extractedUrl)) {
        urls.add(normalizeUrl(extractedUrl));
      }
    }

    return Array.from(urls);
  } catch (err: unknown) {
    console.error(`Failed to fetch sitemap ${sitemapUrl}:`, err);
    return [];
  }
}

/**
 * Performs a pre-flight HTTP check on a URL to verify its status code (e.g., 200 OK).
 */
export async function preflightCheckUrl(url: string): Promise<{ statusCode: number; statusText: string; isOk: boolean }> {
  try {
    const res = await axios.head(url, {
      timeout: 5000,
      validateStatus: () => true, // Don't throw on error status
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IndexNowIndexer/1.0; +https://indexnow.org)',
      },
    });

    return {
      statusCode: res.status,
      statusText: res.statusText || `${res.status}`,
      isOk: res.status >= 200 && res.status < 300,
    };
  } catch {
    // If HEAD fails (some servers block HEAD), try GET with range header
    try {
      const res = await axios.get(url, {
        timeout: 5000,
        headers: { Range: 'bytes=0-100' },
        validateStatus: () => true,
      });
      return {
        statusCode: res.status,
        statusText: res.statusText || `${res.status}`,
        isOk: res.status >= 200 && res.status < 300,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Connection failed';
      return {
        statusCode: 0,
        statusText: errorMsg,
        isOk: false,
      };
    }
  }
}
