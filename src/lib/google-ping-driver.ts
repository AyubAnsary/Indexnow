import axios from 'axios';
import { DispatchedEngineResult } from './types';

/**
 * Sends sitemap/URL crawl pings directly to Google and Bing ping endpoints.
 */
export async function sendCrawlPing(targetUrlOrSitemap: string): Promise<DispatchedEngineResult[]> {
  const pingServices = [
    {
      name: 'Google Sitemap Ping',
      endpoint: `https://www.google.com/ping?sitemap=${encodeURIComponent(targetUrlOrSitemap)}`,
    },
    {
      name: 'Bing Sitemap Ping',
      endpoint: `https://www.bing.com/ping?sitemap=${encodeURIComponent(targetUrlOrSitemap)}`,
    },
  ];

  const results: DispatchedEngineResult[] = [];

  for (const service of pingServices) {
    const timestamp = new Date().toISOString();
    try {
      const response = await axios.get(service.endpoint, {
        timeout: 6000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
        validateStatus: () => true,
      });

      const isSuccess = response.status >= 200 && response.status < 300;
      results.push({
        engine: 'ping',
        endpoint: service.name,
        success: isSuccess,
        statusCode: response.status,
        message: isSuccess
          ? `Ping accepted by ${service.name} (HTTP ${response.status})`
          : `Ping rejected by ${service.name} (HTTP ${response.status})`,
        timestamp,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Ping request failed';
      results.push({
        engine: 'ping',
        endpoint: service.name,
        success: false,
        statusCode: 0,
        message: `Connection error: ${errorMsg}`,
        timestamp,
      });
    }
  }

  return results;
}
