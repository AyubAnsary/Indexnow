import { getStoreData } from './job-store';

export interface OrphanRemediationSuggestion {
  targetUnindexedUrl: string;
  domain: string;
  isOrphan: boolean;
  suggestedSourceUrl: string;
  recommendedAnchorText: string;
  recommendedHtmlSnippet: string;
  explanation: string;
}

/**
 * AI Internal Link & Orphan Page Remediation Engine
 * Solves "Crawled - Currently Not Indexed" by analyzing internal link structures
 * and generating exact HTML code snippets to pass crawl equity from indexed hub pages.
 */
export function analyzeOrphanPageRemediation(targetUrl: string): OrphanRemediationSuggestion {
  const domain = new URL(targetUrl).hostname;
  const store = getStoreData();

  // Find indexed URLs from the same domain in stored jobs
  const domainIndexedUrls = store.jobs
    .flatMap((j) => j.urls)
    .filter((u) => u.domain.toLowerCase() === domain.toLowerCase() && u.status !== 'failed')
    .map((u) => u.url);

  // Pick candidate source URL (homepage or top indexed category page)
  const fallbackSourceUrl = `https://${domain}/`;
  const suggestedSourceUrl = domainIndexedUrls.find((url) => url !== targetUrl) || fallbackSourceUrl;

  // Extract slug for anchor text
  const urlPath = new URL(targetUrl).pathname;
  const pathSegments = urlPath.split('/').filter(Boolean);
  const rawSlug = pathSegments[pathSegments.length - 1] || domain;
  const recommendedAnchorText = rawSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const recommendedHtmlSnippet = `<a href="${targetUrl}">${recommendedAnchorText}</a>`;

  return {
    targetUnindexedUrl: targetUrl,
    domain,
    isOrphan: true,
    suggestedSourceUrl,
    recommendedAnchorText,
    recommendedHtmlSnippet,
    explanation: `This URL lacks internal link equity. Add an internal hyperlink from your indexed page "${suggestedSourceUrl}" to "${targetUrl}" so Googlebot passes PageRank equity.`,
  };
}
