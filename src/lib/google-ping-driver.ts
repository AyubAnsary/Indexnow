import axios from 'axios';
import { DispatchedEngineResult } from './types';

/**
 * Sends crawler notification pings to RPC ping networks.
 * Note: Legacy sitemap pings (/ping?sitemap=) were deprecated by Google & Bing in favor of IndexNow and Indexing APIs.
 */
export async function sendCrawlPing(targetUrlOrSitemap: string): Promise<DispatchedEngineResult[]> {
  const pingServices = [
    {
      name: 'Ping-O-Matic RPC Network',
      endpoint: `https://pingomatic.com/ping/?title=Site+Update&blogurl=${encodeURIComponent(targetUrlOrSitemap)}&rssurl=${encodeURIComponent(targetUrlOrSitemap)}&chk_weblogscom=on&chk_blogs=on`,
    },
    {
      name: 'IndexNow Central Crawler Ping',
      endpoint: `https://api.indexnow.org/indexnow?url=${encodeURIComponent(targetUrlOrSitemap)}`,
    },
  ];

  const results: DispatchedEngineResult[] = [];

  for (const service of pingServices) {
    const timestamp = new Date().toISOString();
    try {
      const response = await axios.get(service.endpoint, {
        timeout: 6000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; IndexNowIndexer/1.0)',
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
          ? `Crawler Ping accepted by ${service.name} (HTTP ${response.status})`
          : `Ping notification sent to ${service.name} (HTTP ${response.status})`,
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

