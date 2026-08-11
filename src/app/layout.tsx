import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import JsonLdSchema from '@/components/JsonLdSchema';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SilverStone Indexer — Instant Search Engine URL Indexing Tool',
  description:
    'Broadcast URL updates instantly to Google Search Console API, Bing, Yandex, Seznam, and Naver via IndexNow Protocol. Zero-config key proxying, pre-flight checks, and live telemetry.',
  keywords: [
    'IndexNow Tool',
    'Google Indexing API',
    'Instant URL Indexer',
    'Fast Google Indexing',
    'IndexNow Protocol Engine',
    'Sitemap Indexing Service',
    'Bulk URL Indexer',
    'SEO Crawl Accelerator',
  ],
  authors: [{ name: 'SilverStone Engineering Team' }],
  metadataBase: new URL('https://indexpulse.com'),
  openGraph: {
    title: 'SilverStone Indexer — Instant Search Engine URL Indexing Tool',
    description:
      'Fastest way to get new web pages, blog posts, and e-commerce products indexed across Google, Bing, and Yandex.',
    url: 'https://indexpulse.com',
    siteName: 'SilverStone Indexer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SilverStone Indexer — Universal Instant URL Indexing Engine',
    description:
      'Broadcast page updates directly to search engine crawlers in seconds using IndexNow + Google API.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLdSchema />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-slate-300 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
