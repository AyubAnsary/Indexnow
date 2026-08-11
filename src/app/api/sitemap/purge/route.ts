import { NextResponse } from 'next/server';
import { parseSitemapXml } from '@/lib/url-validator';
import { auditUrlIndexability } from '@/lib/indexability-auditor';

export async function POST(req: Request) {
  try {
    const { sitemapUrl } = await req.json();
    if (!sitemapUrl || typeof sitemapUrl !== 'string') {
      return NextResponse.json({ error: 'Valid sitemap URL is required.' }, { status: 400 });
    }

    const rawUrls = await parseSitemapXml(sitemapUrl.trim());
    if (rawUrls.length === 0) {
      return NextResponse.json({ error: 'No valid URLs found in sitemap XML.' }, { status: 400 });
    }

    const cleanUrls: string[] = [];
    const purgedUrls: string[] = [];

    for (const urlStr of rawUrls) {
      const audit = await auditUrlIndexability(urlStr);
      if (audit.isIndexable) {
        cleanUrls.push(urlStr);
      } else {
        purgedUrls.push(urlStr);
      }
    }

    const domain = new URL(sitemapUrl).hostname;
    const nowRssDate = new Date().toISOString();

    const cleanXmlItems = cleanUrls
      .map(
        (u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${nowRssDate}</lastmod>\n  </url>`
      )
      .join('\n');

    const cleanSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${cleanXmlItems}\n</urlset>`;

    return NextResponse.json({
      success: true,
      domain,
      originalCount: rawUrls.length,
      cleanCount: cleanUrls.length,
      purgedCount: purgedUrls.length,
      cleanSitemapXml,
      purgedUrls,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sitemap purge failed.' }, { status: 500 });
  }
}
