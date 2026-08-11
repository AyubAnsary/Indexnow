import { NextResponse } from 'next/server';
import { getStoreData } from '@/lib/job-store';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const store = getStoreData();

  // Extract recent URLs for target domain
  const domainJobs = store.jobs.filter((j) =>
    j.urls.some((u) => u.domain.toLowerCase() === domain.toLowerCase())
  );

  const domainUrls = domainJobs.flatMap((j) =>
    j.urls.filter((u) => u.domain.toLowerCase() === domain.toLowerCase())
  ).slice(0, 50);

  const siteUrl = `https://${domain}`;
  const nowRssDate = new Date().toUTCString();

  const itemsXml = domainUrls
    .map(
      (item) => `
    <item>
      <title>${item.url}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.submittedAt ? new Date(item.submittedAt).toUTCString() : nowRssDate}</pubDate>
      <description>SilverStone Quantum Indexer Real-Time Verified Route for ${item.url}</description>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SilverStone Dynamic Feed Hub — ${domain}</title>
    <link>${siteUrl}</link>
    <description>Real-Time Atom/RSS Feed Hub for search crawler discovery</description>
    <language>en</language>
    <pubDate>${nowRssDate}</pubDate>
    <atom:link href="${siteUrl}/feed/${domain}" rel="self" type="application/rss+xml" />
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  });
}
