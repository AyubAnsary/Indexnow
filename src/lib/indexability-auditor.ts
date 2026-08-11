import { isSsrfSafeUrl } from './security';

export interface IndexabilityAuditResult {
  url: string;
  isIndexable: boolean;
  score: number; // 0 to 100
  statusCode: number;
  statusText: string;
  ttfbMs: number;
  hasNoindex: boolean;
  canonicalUrl?: string;
  canonicalMatches: boolean;
  hasSchemaJsonLd: boolean;
  hasOpenGraph: boolean;
  blockers: string[];
  recommendations: string[];
}

/**
 * AI Caffeine Pre-Flight Indexability Auditor
 * Simulates Googlebot Caffeine Indexer to pre-audit URLs before spending user quota.
 */
export async function auditUrlIndexability(targetUrl: string): Promise<IndexabilityAuditResult> {
  const blockers: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  let statusCode = 0;
  let statusText = 'Unknown';
  let ttfbMs = 0;
  let hasNoindex = false;
  let canonicalUrl: string | undefined;
  let canonicalMatches = true;
  let hasSchemaJsonLd = false;
  let hasOpenGraph = false;

  // SSRF Check
  const ssrf = isSsrfSafeUrl(targetUrl);
  if (!ssrf.safe) {
    return {
      url: targetUrl,
      isIndexable: false,
      score: 0,
      statusCode: 403,
      statusText: 'Forbidden (SSRF Blocked)',
      ttfbMs: 0,
      hasNoindex: true,
      canonicalMatches: false,
      hasSchemaJsonLd: false,
      hasOpenGraph: false,
      blockers: [`SSRF Violation: ${ssrf.reason}`],
      recommendations: ['Provide a public, accessible web URL.'],
    };
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SilverStoneCaffeineAuditor/2.0; +https://indexpulse.com/bot)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'manual',
    });

    clearTimeout(timeout);
    ttfbMs = Date.now() - startTime;
    statusCode = res.status;
    statusText = res.statusText;

    // Check HTTP Status Code
    if (res.status !== 200) {
      score -= 50;
      blockers.push(`HTTP ${res.status} (${res.statusText}) returned. Search engines require HTTP 200 OK.`);
      recommendations.push('Fix server response status code to return 200 OK.');
    }

    // Check TTFB Latency
    if (ttfbMs > 2500) {
      score -= 15;
      recommendations.push(`High TTFB latency (${ttfbMs}ms). Optimize server response time under 1.5s.`);
    }

    // Check HTTP X-Robots-Tag Header
    const xRobotsTag = res.headers.get('x-robots-tag')?.toLowerCase() || '';
    if (xRobotsTag.includes('noindex') || xRobotsTag.includes('none')) {
      hasNoindex = true;
      score -= 50;
      blockers.push('Header "X-Robots-Tag: noindex" detected in HTTP headers.');
      recommendations.push('Remove "noindex" from your server response headers.');
    }

    // Parse HTML DOM content
    const htmlText = await res.text();
    const lowerHtml = htmlText.toLowerCase();

    // Check HTML <meta name="robots"> tag
    const metaRobotsMatch = /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i.exec(htmlText);
    if (metaRobotsMatch) {
      const metaContent = metaRobotsMatch[1].toLowerCase();
      if (metaContent.includes('noindex') || metaContent.includes('none')) {
        hasNoindex = true;
        score -= 50;
        blockers.push('HTML tag <meta name="robots" content="noindex"> detected.');
        recommendations.push('Remove content="noindex" from HTML <head> meta tag.');
      }
    }

    // Check <link rel="canonical"> tag
    const canonicalMatch = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(htmlText);
    if (canonicalMatch) {
      canonicalUrl = canonicalMatch[1].trim();
      try {
        const canonicalParsed = new URL(canonicalUrl, targetUrl).href;
        const targetParsed = new URL(targetUrl).href;

        if (canonicalParsed !== targetParsed) {
          canonicalMatches = false;
          score -= 20;
          blockers.push(`Canonical mismatch: Pointing to "${canonicalUrl}" instead of target URL.`);
          recommendations.push('Ensure rel="canonical" points exactly to the submitted page URL.');
        }
      } catch {
        canonicalMatches = false;
      }
    }

    // Check Structured Data (JSON-LD)
    if (lowerHtml.includes('application/ld+json')) {
      hasSchemaJsonLd = true;
    } else {
      score -= 10;
      recommendations.push('Add Schema.org JSON-LD structured data for rich snippets.');
    }

    // Check Open Graph Meta Tags
    if (lowerHtml.includes('property="og:') || lowerHtml.includes('property=\'og:')) {
      hasOpenGraph = true;
    } else {
      score -= 5;
      recommendations.push('Add Open Graph meta tags (og:title, og:image) for social discovery.');
    }
  } catch (err: any) {
    ttfbMs = Date.now() - startTime;
    statusCode = 504;
    statusText = err.name === 'AbortError' ? 'Gateway Timeout (8s)' : 'Connection Failed';
    score = 0;
    blockers.push(`Failed to reach URL: ${err.message || 'Server timeout'}`);
    recommendations.push('Ensure your web server is online and publicly accessible.');
  }

  score = Math.max(0, Math.min(100, score));
  const isIndexable = blockers.length === 0 && statusCode === 200 && !hasNoindex;

  return {
    url: targetUrl,
    isIndexable,
    score,
    statusCode,
    statusText,
    ttfbMs,
    hasNoindex,
    canonicalUrl,
    canonicalMatches,
    hasSchemaJsonLd,
    hasOpenGraph,
    blockers,
    recommendations,
  };
}
