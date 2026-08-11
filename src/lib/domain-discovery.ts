import { parseSitemapXml } from './url-validator';
import { auditUrlIndexability } from './indexability-auditor';

export interface DomainCoverageReport {
  domain: string;
  totalDiscovered: number;
  indexedCount: number;
  unindexedCount: number;
  coveragePercent: number;
  indexedUrls: string[];
  unindexedUrls: string[];
  suggestedDailyRate: number;
  estimatedDaysToComplete: number;
}

/**
 * Domain Auto-Discovery & Coverage Engine
 * Auto-fetches site URLs from sitemaps, audits live index coverage, and creates a drip plan.
 */
export async function discoverAndAuditDomain(domainInput: string): Promise<DomainCoverageReport> {
  const cleanDomain = domainInput
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();

  const sitemapUrl = `https://${cleanDomain}/sitemap.xml`;
  let discoveredUrls: string[] = [];

  try {
    discoveredUrls = await parseSitemapXml(sitemapUrl);
  } catch {
    // Fallback root URL if sitemap fetch fails
  }

  if (discoveredUrls.length === 0) {
    discoveredUrls = [`https://${cleanDomain}/`];
  }

  const indexedUrls: string[] = [];
  const unindexedUrls: string[] = [];

  for (const url of discoveredUrls) {
    const audit = await auditUrlIndexability(url);
    if (audit.isIndexable) {
      indexedUrls.push(url);
    } else {
      unindexedUrls.push(url);
    }
  }

  const totalDiscovered = discoveredUrls.length;
  const indexedCount = indexedUrls.length;
  const unindexedCount = unindexedUrls.length;
  const coveragePercent = totalDiscovered > 0 ? Math.round((indexedCount / totalDiscovered) * 100) : 0;

  // Safe daily release rate calculation (e.g. 50 URLs/day)
  const suggestedDailyRate = Math.min(250, Math.max(20, Math.round(unindexedCount / 10) || 50));
  const estimatedDaysToComplete = unindexedCount > 0 ? Math.ceil(unindexedCount / suggestedDailyRate) : 0;

  return {
    domain: cleanDomain,
    totalDiscovered,
    indexedCount,
    unindexedCount,
    coveragePercent,
    indexedUrls,
    unindexedUrls,
    suggestedDailyRate,
    estimatedDaysToComplete,
  };
}
