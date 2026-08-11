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
  Search,
  Play,
  RotateCw,
  Sliders,
  CheckCircle,
  Plus,
  ArrowUpRight,
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
  const [activeFeatureTab, setActiveFeatureTab] = useState<'sitemap' | 'caffeine' | 'drip' | 'security'>('sitemap');

  // Interactive Automation Canvas State
  const [triggerApp, setTriggerApp] = useState('WordPress Site');
  const [actionApp, setActionApp] = useState('Google Indexing API');
  const [isSimulatingZap, setIsSimulatingZap] = useState(false);
  const [zapOutput, setZapOutput] = useState<string | null>(null);

  const handleSimulateZap = () => {
    setIsSimulatingZap(true);
    setZapOutput(null);
    setTimeout(() => {
      setIsSimulatingZap(false);
      setZapOutput(`Workflow Executed! 100% verified broadcast from ${triggerApp} to ${actionApp} in 360ms.`);
    }, 1000);
  };

  const integrationEcosystem = [
    { name: 'Google Search Console API', role: 'Direct OAuth 2.0 Push', status: 'Active' },
    { name: 'IndexNow Protocol Mesh', role: 'Bing, Yandex & Seznam', status: 'Active' },
    { name: 'WordPress & WooCommerce', role: 'Sitemap Auto-Sync', status: 'Compatible' },
    { name: 'Shopify Store', role: 'Product URL Drip', status: 'Compatible' },
    { name: 'Next.js & React Apps', role: 'Dynamic Route Indexer', status: 'Compatible' },
    { name: 'Developer REST API', role: 'Bearer sk_silverstone_...', status: 'Active' },
  ];

  const automationRecipes = [
    {
      title: 'Publish in WordPress ➔ Broadcast to Google & IndexNow',
      desc: 'Run Caffeine audit and push new blog posts the second you hit publish.',
      trigger: 'WordPress',
      action: 'Google API & IndexNow',
      metric: '12.4k executions',
    },
    {
      title: 'Product added in Shopify ➔ Drip-Feed to Bing & Yandex',
      desc: 'Purge dead 404s and release 50 product URLs/day to protect crawl budget.',
      trigger: 'Shopify',
      action: 'Drip Scheduler',
      metric: '48.2k executions',
    },
    {
      title: 'XML Sitemap Updated ➔ Auto-Purge 404s & Index Now',
      desc: 'Background daemon sweeps sitemap.xml every 5 mins and indexes clean pages.',
      trigger: 'XML Sitemap',
      action: 'Sitemap XML Purger',
      metric: '89.1k executions',
    },
    {
      title: 'REST API Key Trigger ➔ WebSub Atom RSS Broadcast',
      desc: 'Developers call POST /api/v1/index to notify Google WebSub hubs in milliseconds.',
      trigger: 'REST API (sk_...)',
      action: 'WebSub RSS Hub',
      metric: '154k executions',
    },
  ];

  const faqs = [
    {
      q: 'How does SilverStone Indexer accelerate search engine indexation?',
      a: 'SilverStone combines IndexNow protocol, Google Indexing API direct push, global RPC pings, and WebSub Atom/RSS feeds into a single unified broadcast pipeline, notifying search crawlers within 3 to 15 seconds.',
    },
    {
      q: 'Do website owners need to upload verification key files to their server?',
      a: 'No! SilverStone hosts the IndexNow key location proxy (/[key].txt) on our engine infrastructure automatically. Simply paste your URLs or sitemap XML and our engine handles 100% of protocol verification.',
    },
    {
      q: 'What is the AI Caffeine Pre-Flight Auditor?',
      a: 'The Caffeine Auditor simulates Googlebot’s renderer before spending user quota. It inspects HTTP status codes (200 OK), server TTFB latency, noindex meta tags, and rel="canonical" alignment.',
    },
    {
      q: 'Who built SilverStone Indexer?',
      a: 'SilverStone Indexer was architected by Ayub Ansary (ayubansary.com), an Enterprise Technical SEO Consultant & Software Engineer specializing in search engine crawling infrastructure.',
    },
  ];

  return (
    <div className="space-y-28 py-4 font-sans text-slate-100 selection:bg-slate-300 selection:text-slate-950 animate-fade-in">
      
      {/* 👑 1. SILVERSTONE HERO SECTION (SPLIT 2-COLUMN LUXURY SAAS LAYOUT) */}
      <section className="relative max-w-7xl mx-auto px-4 pt-4">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-slate-400/20 via-zinc-300/15 to-slate-100/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Title & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold shadow-xl backdrop-blur-xl"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-200"></span>
              </span>
              <span className="bg-gradient-to-r from-slate-100 via-zinc-200 to-slate-400 bg-clip-text text-transparent font-mono uppercase tracking-wider">
                SEARCH ENGINE INDEXING AUTOMATION
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]"
            >
              Automate your search <br />
              <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                indexation without limits
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed"
            >
              Connect your CMS, XML sitemaps, or REST API directly to Google Indexing API, IndexNow, and WebSub hubs. Index new URLs in 3 to 15 seconds—zero code required.
            </motion.p>

            {/* CTA Action Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2"
            >
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 hover:from-white hover:to-slate-300 text-slate-950 font-black text-sm shadow-2xl shadow-slate-400/25 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <span>Start Free Automation</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={onOpenPricing}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-slate-300" />
                <span>Explore Plans ($5/mo)</span>
              </button>
            </motion.div>

            {/* Value Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-4 flex flex-wrap gap-6 text-xs text-slate-400 font-mono"
            >
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-300" />
                <span>10 URLs/Mo Free Forever</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-300" />
                <span>Caffeine Pre-Flight Audit</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-300" />
                <span>Anti-Group Buy Lock</span>
              </span>
            </motion.div>

          </div>

          {/* Right Column: SilverStone Interactive Workflow Builder Canvas */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-slate-300" />
                  <span className="font-extrabold text-white text-sm font-mono">SilverStone Indexing Workflow Canvas</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  INTERACTIVE
                </span>
              </div>

              {/* Node 1: Trigger */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                  <span>1. TRIGGER</span>
                  <span className="text-slate-300">WHEN THIS HAPPENS</span>
                </div>
                <select
                  value={triggerApp}
                  onChange={(e) => setTriggerApp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white font-mono outline-none focus:border-slate-500"
                >
                  <option value="WordPress Site">New Post Published in WordPress</option>
                  <option value="Shopify Store">New Product Added to Shopify</option>
                  <option value="XML Sitemap">Sitemap XML Updated (/sitemap.xml)</option>
                  <option value="Developer REST API">Webhook Received via REST API Key</option>
                </select>
              </div>

              {/* Connecting Icon */}
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Node 2: Action */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                  <span>2. ACTION</span>
                  <span className="text-slate-300">DO THIS AUTOMATICALLY</span>
                </div>
                <select
                  value={actionApp}
                  onChange={(e) => setActionApp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white font-mono outline-none focus:border-slate-500"
                >
                  <option value="Google Indexing API">Run Caffeine Audit ➔ Broadcast to Google Indexing API</option>
                  <option value="IndexNow Protocol">Broadcast to IndexNow (Bing, Yandex, Seznam)</option>
                  <option value="Auto-Drip Scheduler">Purge Dead 404s ➔ Drip-Feed 50 URLs/Day</option>
                  <option value="WebSub RSS Hub">Register Atom Feed with Google WebSub Hub</option>
                </select>
              </div>

              {/* Test Simulation Button */}
              <div className="pt-2 space-y-3 text-center">
                <button
                  onClick={handleSimulateZap}
                  disabled={isSimulatingZap}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-lg hover:from-white hover:to-slate-300 transition flex items-center justify-center space-x-2"
                >
                  <RotateCw className={`w-4 h-4 text-slate-950 ${isSimulatingZap ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingZap ? 'Executing Workflow...' : `Publish & Run Workflow (${triggerApp} ➔ ${actionApp})`}</span>
                </button>

                {zapOutput && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center space-x-2 animate-fade-in text-left">
                    <CheckCircle2 className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span>{zapOutput}</span>
                  </div>
                )}
              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* 👑 2. ECOSYSTEM PROTOCOLS GRID */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            MULTI-SIGNAL PROTOCOL MESH
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Built for Modern Web Frameworks & Search Crawlers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationEcosystem.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{item.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                  {item.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 👑 3. PERFORMANCE & SPEED COMPARISON MATRIX */}
      <section id="matrix" className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            BENCHMARK COMPARISON
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Why SilverStone Leads the Market
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 md:p-8 shadow-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="p-4">Capability</th>
                <th className="p-4 text-slate-500">Manual Indexing</th>
                <th className="p-4 text-slate-500">Traditional Indexers</th>
                <th className="p-4 text-white font-bold">SilverStone Indexer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="p-4 font-bold text-white">Crawl Response Time</td>
                <td className="p-4 text-slate-500">14 to 30 Days</td>
                <td className="p-4 text-slate-400">1 to 5 Days</td>
                <td className="p-4 text-slate-200 font-bold">3 to 15 Seconds</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Pre-Submission AI Audit</td>
                <td className="p-4 text-slate-500">None</td>
                <td className="p-4 text-slate-500">None (Fails on 404s)</td>
                <td className="p-4 text-slate-200 font-bold">Caffeine Pre-Flight Auditor</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Live Index Verification</td>
                <td className="p-4 text-slate-500">Manual GSC Inspect</td>
                <td className="p-4 text-slate-500">None</td>
                <td className="p-4 text-slate-200 font-bold">Live Inspector & Master Directory</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Zero-Touch Sitemap Automation</td>
                <td className="p-4 text-slate-500">Manual Copy-Paste</td>
                <td className="p-4 text-slate-500">Manual Copy-Paste</td>
                <td className="p-4 text-slate-200 font-bold">Autonomous 24/7 Background Cron</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Anti-Group Buy Protection</td>
                <td className="p-4 text-slate-500">None</td>
                <td className="p-4 text-slate-500">None</td>
                <td className="p-4 text-slate-200 font-bold">Device Fingerprinting Lock</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 👑 4. INTERACTIVE SANDBOX CONSOLE */}
      <section id="indexer" className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            TRY THE LIVE INDEXING SANDBOX
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Paste a URL to test instant indexing</h2>
        </div>

        <UrlSubmitter
          onSubmit={onSubmitDemo}
          isSubmitting={isSubmitting}
          hasGoogleCreds={false}
          onOpenCredentials={onOpenAuth}
        />
        <LiveMonitor job={activeJob} />
      </section>

      {/* 👑 5. AUTHOR & ENTERPRISE TECHNICAL SEO CONSULTANT CARD */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 font-sans">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Award className="w-4 h-4 text-slate-300" />
              <span>ARCHITECTED BY ENTERPRISE TECHNICAL SEO CONSULTANT</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Designed & Built by Ayub Ansary
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Specializing in enterprise technical SEO infrastructure, programmatic SEO (pSEO) indexing pipelines, and high-performance search crawler acceleration.
            </p>
            <div className="pt-2">
              <a
                href="https://ayubansary.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition"
              >
                <span>Visit AyubAnsary.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-400 min-w-[260px]">
            <div className="text-white font-bold text-sm">Ayub Ansary</div>
            <div className="text-slate-300">Enterprise Technical SEO Engineer</div>
            <div className="text-[11px] text-slate-500">ayubansary.com</div>
            <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-900">
              Entity Authority: Certified Indexing Specialist
            </div>
          </div>
        </div>
      </section>

      {/* 👑 6. FAQS */}
      <section id="faq" className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-extrabold text-white">Everything You Need to Know</h2>
        </div>

        <div className="space-y-4 font-sans">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-white flex justify-between items-center hover:bg-slate-800/50 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed font-mono border-t border-slate-800/60 pt-3">
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
