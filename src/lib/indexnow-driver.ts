import axios from 'axios';
import crypto from 'crypto';
import { DispatchedEngineResult, IndexNowOptions } from './types';
import { extractDomain } from './url-validator';

/**
 * Standard IndexNow Search Engine API endpoints.
 * When submitted to one participating search engine, it automatically broadcasts to others!
 */
export const INDEXNOW_ENDPOINTS = [
  { name: 'IndexNow Global Central', url: 'https://api.indexnow.org/indexnow' },
  { name: 'Bing IndexNow', url: 'https://www.bing.com/indexnow' },
  { name: 'Yandex IndexNow', url: 'https://yandex.com/indexnow' },
  { name: 'Seznam IndexNow', url: 'https://search.seznam.cz/indexnow' },
  { name: 'Naver IndexNow', url: 'https://searchadvisor.naver.com/indexnow' },
];

/**
 * Generates a standard 32-character hexadecimal key for IndexNow verification.
 */
export function generateIndexNowKey(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Groups a list of URLs by host domain, as required by IndexNow protocol.
 */
export function groupUrlsByHost(urls: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const url of urls) {
    const host = extractDomain(url);
    if (!grouped[host]) {
      grouped[host] = [];
    }
    grouped[host].push(url);
  }
  return grouped;
}

/**
 * Broadcasts batch URLs to IndexNow endpoints for a single host domain.
 */
export async function submitToIndexNow(
  host: string,
  urlList: string[],
  options: IndexNowOptions & { appBaseUrl?: string } = {}
): Promise<DispatchedEngineResult[]> {
  const key = options.hostKey || generateIndexNowKey();
  
  // Use our indexer engine's hosted key location so users don't have to upload key files to their own website!
  const appBaseUrl = options.appBaseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const keyLocation = options.keyLocation || `${appBaseUrl}/${key}.txt`;
  
  const results: DispatchedEngineResult[] = [];

  // IndexNow payload format with engine-managed keyLocation
  const payload = {
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urlList,
  };


  // We broadcast to primary IndexNow endpoint (api.indexnow.org) and Bing
  const targetEndpoints = options.customEndpoints || [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const endpointUrl of targetEndpoints) {
    const timestamp = new Date().toISOString();
    try {
      const response = await axios.post(endpointUrl, payload, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'IndexNow-Universal-Indexer/1.0',
        },
        timeout: 8000,
        validateStatus: () => true, // capture all status codes
      });

      const isSuccess = response.status === 200 || response.status === 202;
      let message = `HTTP ${response.status}: `;

      switch (response.status) {
        case 200:
          message += 'URL submitted successfully.';
          break;
        case 202:
          message += 'URL accepted. Key verification pending.';
          break;
        case 400:
          message += 'Invalid request payload format.';
          break;
        case 403:
          message += 'Forbidden. Invalid key or key location mismatch.';
          break;
        case 422:
          message += 'Unprocessable entity. URLs do not belong to host.';
          break;
        case 429:
          message += 'Too Many Requests (Rate limited).';
          break;
        default:
          message += response.statusText || 'Engine responded.';
      }

      results.push({
        engine: 'indexnow',
        endpoint: endpointUrl,
        success: isSuccess,
        statusCode: response.status,
        message,
        timestamp,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error';
      results.push({
        engine: 'indexnow',
        endpoint: endpointUrl,
        success: false,
        statusCode: 0,
        message: `Network failure connecting to IndexNow endpoint: ${errorMsg}`,
        timestamp,
      });
    }
  }

  return results;
}
