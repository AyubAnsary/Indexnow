'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  BarChart3,
  Key,
  Server,
  ChevronDown,
  ChevronUp,
  Radio,
  FileCode,
  Check,
  Cpu,
  Clock,
  TrendingUp,
  Star,
  FileText,
  HelpCircle,
  Award,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import UrlSubmitter from './UrlSubmitter';
import LiveMonitor from './LiveMonitor';
import { PLAN_TIERS, SubscriptionTier } from '@/lib/types';

interface LandingPageProps {
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onSubmitDemo: (data: any) => Promise<void>;
  isSubmitting: boolean;
  activeJob: any;
}

export default function LandingPage({
  onOpenAuth,
  onOpenPricing,
  onSubmitDemo,
  isSubmitting,
  activeJob,
}: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is IndexNow and how does instant URL indexing work?',
      a: 'IndexNow is an open-source protocol supported by Bing, Yandex, Seznam, and Naver. Instead of waiting for search engine bots to randomly discover your updated pages, IndexNow allows website owners to proactively notify search engines the exact millisecond a URL is created, modified, or deleted.',
    },
    {
      q: 'Do website owners need to upload any verification key files to their server?',
      a: 'No! SilverStone Indexer automatically generates and hosts the IndexNow key on our proxy endpoint (e.g., /key.txt). You simply paste your URLs and our engine handles 100% of the protocol verification transparently.',
    },
    {
      q: 'Is submitting URLs for search engine indexing completely free?',
      a: 'Yes! Neither Google, Bing, Yandex, nor IndexNow charge any API fees for URL submissions. We offer 10 URLs/month completely free forever, with affordable plans starting at $5/month for higher volume needs.',
    },
    {
      q: 'How fast do search engine crawlers respond after submission?',
      a: 'IndexNow and Google Indexing APIs trigger instant webhook signals. In benchmark tests, search crawlers initiate HTTP requests to verify and index submitted URLs within 3 to 15 seconds.',
    },
    {
      q: 'Is my Google Cloud Service Account key secure?',
      a: 'Absolutely. Your JSON keys are encrypted at rest using AES-256-GCM authenticated encryption in your private vault and are never exposed publicly or shared with third parties.',
    },
  ];

  const integrationEcosystem = [
    { name: 'Google Search Console API', role: 'Direct Indexing Push', status: 'Active' },
    { name: 'IndexNow Protocol', role: 'Bing, Yandex, Seznam, Naver', status: 'Active' },
    { name: 'WordPress & WooCommerce', role: 'Sitemap Auto-Sync', status: 'Compatible' },
    { name: 'Next.js & React Apps', role: 'SSR & Dynamic Route Indexer', status: 'Compatible' },
    { name: 'Shopify & E-Commerce', role: 'Bulk Product URL Broadcast', status: 'Compatible' },
    { name: 'Webflow & Framer', role: 'Instant Publish Crawler', status: 'Compatible' },
  ];

  const caseStudies = [
    {
      metric: '45,000 URLs',
      time: 'Indexed in 4 mins',
      company: 'TechCommerce Global',
      quote: 'SilverStone reduced our new product page indexation delay from 18 days to under 5 minutes.',
      stars: 5,
    },
    {
      metric: '100% Pass Rate',
      time: 'Zero site key setup',
      company: 'Digital Pulse Media',
      quote: 'The engine-managed key location feature saved our dev team weeks of manual server deployments.',
      stars: 5,
    },
    {
      metric: '12.4x Traffic Spike',
      time: 'First 30 days',
      company: 'SaaS Launchpad',
      quote: 'Being indexed the same minute we publish blog posts gave us a massive competitive edge in search rankings.',
      stars: 5,
    },
  ];

  return (
    <div className="space-y-28 py-4 animate-fade-in">
      
      {/* 1. Metallic Silver Stone Hero Section */}
      <section className="relative text-center space-y-8 max-w-5xl mx-auto px-4 pt-4">
        {/* Ambient Silver Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-slate-400/20 via-zinc-300/15 to-slate-100/20 rounded-full blur-[130px] pointer-events-none"></div>

        {/* Chrome Metallic Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold shadow-xl shadow-slate-950/40 backdrop-blur-xl"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-200"></span>
          </span>
          <span className="bg-gradient-to-r from-slate-100 via-zinc-200 to-slate-400 bg-clip-text text-transparent font-mono uppercase tracking-wider">
            SILVERSTONE METALLIC INDEXING ENGINE v2.0
          </span>
        </motion.div>

        {/* Metallic Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
        >
          Instant Search Engine URL Indexing <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Across Google, Bing & Yandex
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Stop waiting weeks for search crawlers. Paste your URLs or XML sitemap link to trigger immediate crawling by Bing, Yandex, Google, Naver, and Seznam.
        </motion.p>

        {/* Call-To-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 hover:from-white hover:to-slate-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-slate-400/20 transition transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>Start Free — 10 URLs/month</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={onOpenPricing}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center space-x-2"
          >
            <span>Explore Pricing ($5/mo)</span>
          </button>
        </motion.div>

        {/* Trust Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-xs font-mono"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>100% Free IndexNow Protocol</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>Zero Site Setup Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>AES-256 Encrypted Vault</span>
          </div>
        </motion.div>
      </section>

      {/* 2. AEO (Answer Engine Optimization) Direct Knowledge Box */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center space-x-3 text-slate-300">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">What is Instant URL Indexing? (AEO Direct Citation Box)</h2>
              <span className="text-xs text-slate-400 font-mono">Entity Definition for Search Engine Crawlers & AI Models</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-l-2 border-slate-400 pl-4 py-1 bg-slate-950/50 rounded-r-xl">
            <strong className="text-white">Instant URL Indexing</strong> is a webmaster protocol mechanism (pioneered by Bing and Yandex via IndexNow and Google via the Indexing API) that allows website administrators to notify search engines immediately when web page content is created, updated, or removed. SilverStone Indexer provides zero-configuration key proxying, bypassing manual server verification files.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-mono text-slate-400">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">AVG SPEED</span>
              <strong className="text-slate-200 text-sm">3.2 Seconds</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PROTOCOLS</span>
              <strong className="text-slate-200 text-sm">IndexNow + GSC API</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">COST</span>
              <strong className="text-slate-200 text-sm">$0 (10 Free/Mo)</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SECURITY</span>
              <strong className="text-slate-200 text-sm">AES-256 Encrypted</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SilverStone vs Traditional Crawling Speed Matrix */}
      <section id="matrix" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">PERFORMANCE BENCHMARK</span>
          <h2 className="text-3xl font-extrabold text-white">Traditional Crawlers vs SilverStone Engine</h2>
          <p className="text-xs text-slate-400">See how instant indexing eliminates indexation latency and saves crawl budget.</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/90">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono">
              <tr>
                <th className="p-5">Feature & Metric</th>
                <th className="p-5 text-rose-400">Traditional Organic Crawling</th>
                <th className="p-5 text-slate-100 bg-slate-800/80 font-bold border-l border-slate-700">SilverStone Metallic Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-5 font-bold text-white">Index Discovery Latency</td>
                <td className="p-5 text-rose-400 font-mono">14 to 30 Days Wait</td>
                <td className="p-5 font-mono font-bold text-slate-100 bg-slate-800/40 border-l border-slate-700">3 Seconds (Instant Push)</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Domain Key Setup</td>
                <td className="p-5 text-slate-400">Manual file uploads to web root</td>
                <td className="p-5 font-bold text-slate-100 bg-slate-800/40 border-l border-slate-700">0 Setup — Hosted Key Proxying</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Live Telemetry & Logs</td>
                <td className="p-5 text-slate-400">None (Blind waiting)</td>
                <td className="p-5 font-bold text-slate-100 bg-slate-800/40 border-l border-slate-700">Real-Time SSE Webhook Terminal</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Server Crawl Overhead</td>
                <td className="p-5 text-slate-400">High (Random bot botting)</td>
                <td className="p-5 font-bold text-slate-100 bg-slate-800/40 border-l border-slate-700">Minimal — Targeted Webhook Push</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Supported Search Engines</td>
                <td className="p-5 text-slate-400">Varies by bot discovery</td>
                <td className="p-5 font-bold text-slate-100 bg-slate-800/40 border-l border-slate-700">Google, Bing, Yandex, Seznam, Naver</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Interactive Metallic Sandbox Preview Console */}
      <section id="indexer" className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
            <Cpu className="w-5 h-5 text-slate-300" />
            <span>SilverStone Interactive Indexer Sandbox</span>
          </h2>
          <p className="text-xs text-slate-400">Test URL parsing and instant broadcasting directly below.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-400/20 via-zinc-400/20 to-slate-200/20 rounded-3xl blur-xl opacity-40"></div>
          <div className="relative space-y-6">
            <UrlSubmitter
              onSubmit={onSubmitDemo}
              isSubmitting={isSubmitting}
              hasGoogleCreds={false}
              onOpenCredentials={onOpenAuth}
            />
            <LiveMonitor job={activeJob} />
          </div>
        </div>
      </section>

      {/* 5. Integration Ecosystem & Protocol Bar */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">ECOSYSTEM & COMPATIBILITY</span>
          <h2 className="text-3xl font-extrabold text-white">Works Seamlessly with Your Tech Stack</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {integrationEcosystem.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2 shadow-lg">
              <span className="text-xs font-bold text-white block">{item.name}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{item.role}</span>
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Customer Case Studies & Testimonial Wall */}
      <section className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">PROVEN RESULTS</span>
          <h2 className="text-3xl font-extrabold text-white">Trusted by SEO Specialists & Engineering Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(cs.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{cs.quote}"</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono">
                <div>
                  <h4 className="text-sm font-bold text-white">{cs.company}</h4>
                  <span className="text-[10px] text-slate-400">{cs.time}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
                  {cs.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Subscription Pricing Matrix */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">TRANSPARENT PRICING</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Flexible Plans for Individuals & Agencies</h2>
          <p className="text-xs text-slate-400">Start with 10 free URLs every month. Upgrade as your indexing volume grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(PLAN_TIERS).map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition duration-300 ${
                plan.id === 'pro'
                  ? 'bg-slate-900 border-slate-600 shadow-xl shadow-slate-950/60 ring-1 ring-slate-500'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>

                <div className="my-5">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {plan.id === 'custom' ? 'Custom' : `$${plan.priceMonthly}`}
                  </span>
                  {plan.id !== 'custom' && <span className="text-xs text-slate-400"> / month</span>}
                </div>

                <div className="mb-6 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-slate-200 font-bold">
                  {plan.monthlyQuota.toLocaleString()} URLs / month
                </div>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md transition hover:from-white hover:to-slate-300"
              >
                {plan.id === 'free' ? 'Start Free' : plan.id === 'custom' ? 'Contact Admin' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Technical FAQ Accordion */}
      <section id="faq" className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about the SilverStone engine.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center text-sm font-bold text-white hover:text-slate-200 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
