'use client';

import React from 'react';

export default function JsonLdSchema() {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SilverStone Indexer',
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication',
    description:
      'Universal URL Indexer Engine broadcasting page updates instantly to Google Search Console API, Bing, Yandex, Naver, and Seznam via IndexNow Protocol.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '15',
      offerCount: '3',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1240',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is IndexNow and how does instant URL indexing work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'IndexNow is an open-source protocol supported by Bing, Yandex, Seznam, and Naver that allows website owners to instantly notify search engines when web pages are created, updated, or deleted.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to upload key files to my domain to use SilverStone Indexer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. SilverStone Indexer automatically hosts and manages the verification key on our proxy endpoint. You simply submit your URLs and our engine handles 100% of the protocol verification.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is submitting URLs for indexing free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Neither Google nor IndexNow charge fees for URL indexing. SilverStone includes 10 URLs per month completely free for all users.',
        },
      },
      {
        '@type': 'Question',
        name: 'How fast do search engine crawlers request URLs after submission?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Search engine crawlers typically receive and process the webhook payload within seconds, requesting the URL for indexing shortly thereafter.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
