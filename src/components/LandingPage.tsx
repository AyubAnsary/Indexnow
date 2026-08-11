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

  // Zapier-Style Interactive Workflow Builder State
  const [sourceApp, setSourceApp] = useState('WordPress Site');
  const [targetEngine, setTargetEngine] = useState('Google Search Console & IndexNow');
  const [isSimulatingZap, setIsSimulatingZap] = useState(false);
  const [zapOutput, setZapOutput] = useState<string | null>(null);

  const handleSimulateZap = () => {
    setIsSimulatingZap(true);
    setZapOutput(null);
    setTimeout(() => {
      setIsSimulatingZap(false);
      setZapOutput(`Automation Executed! 100% verified broadcast from ${sourceApp} to ${targetEngine} in 420ms.`);
    }, 1200);
  };

  const faqs = [
    {
      q: 'How does SilverStone compare to Zapier for indexing automation?',
      a: 'Zapier automates app tasks, but SilverStone is built specifically for search engine crawling pipelines. SilverStone connects your CMS, sitemaps, or REST API directly to Google Indexing API, IndexNow (Bing/Yandex), WebSub, and RPC networks with zero code required.',
    },
    {
      q: 'Do website owners need to upload any verification key files to their server?',
      a: 'No! SilverStone Indexer automatically generates and hosts the IndexNow key on our proxy endpoint (e.g., /key.txt). You simply paste your URLs or sitemap and our engine handles 100% of the protocol verification transparently.',
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
      q: 'How does Anti-Group Buy protection safeguard my workspace?',
      a: 'Our Device Lock Engine binds session tokens to Client IP + User-Agent fingerprints. If an unauthorized extension or third party copies your session cookie, the system detects the fingerprint mismatch and instantly invalidates the request.',
    },
  ];

  const integrationEcosystem = [
    { name: 'Google Search Console API', role: 'Direct OAuth 2.0 Indexing Push', status: 'Active' },
    { name: 'IndexNow Protocol Mesh', role: 'Bing, Yandex, Seznam & Naver', status: 'Active' },
    { name: 'WordPress & WooCommerce', role: 'Sitemap & Post Auto-Sync', status: 'Compatible' },
    { name: 'Shopify & E-Commerce', role: 'Bulk Product URL Broadcast', status: 'Compatible' },
    { name: 'Next.js & React Apps', role: 'SSR & Dynamic Route Indexer', status: 'Compatible' },
    { name: 'Zapier & Webhooks', role: 'REST API Key Integration (sk_silverstone_...)', status: 'Active' },
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
    <div className="space-y-28 py-4 animate-fade-in font-sans">
      
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
            AUTOMATION FOR SEARCH ENGINE INDEXING
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
        >
          Automate Your Indexing <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Across Google, Bing & Yandex
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Connect your CMS, XML sitemaps, or REST API directly to Google Indexing API, IndexNow, and WebSub hubs. Zero code required.
        </motion.p>

        {/* Hero CTA Action Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
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

        {/* Value Proposition Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-mono"
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
      </section>

      {/* ⚡ 2. Zapier-Style Interactive Workflow Builder Widget */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-6 md:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              INTERACTIVE AUTOMATION BUILDER
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Connect Any Publishing Source to Search Engines
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Select your source trigger and search engine destination to simulate an automated indexing workflow.
            </p>
          </div>

          {/* Interactive Automation Node Canvas */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              
              {/* Trigger Node */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-slate-300" />
                  <span>1. WHEN THIS HAPPENS (TRIGGER)</span>
                </span>
                <select
                  value={sourceApp}
                  onChange={(e) => setSourceApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-slate-500"
                >
                  <option value="WordPress Site">New Post Published in WordPress</option>
                  <option value="XML Sitemap Update">Sitemap XML Discovered (/sitemap.xml)</option>
                  <option value="Shopify Store">New Product Created in Shopify</option>
                  <option value="Developer REST API">Webhook Received via REST API Key</option>
                </select>
              </div>

              {/* Connecting Pulse Line */}
              <div className="md:col-span-1 flex items-center justify-center py-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Action Node */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <Play className="w-3.5 h-3.5 text-slate-300" />
                  <span>2. DO THIS AUTOMATICALLY (ACTION)</span>
                </span>
                <select
                  value={targetEngine}
                  onChange={(e) => setTargetEngine(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-white outline-none focus:border-slate-500"
                >
                  <option value="Google Search Console & IndexNow">Run Caffeine Audit ➔ Broadcast to Google & IndexNow</option>
                  <option value="Auto-Drip Scheduler">Purge Dead 404s ➔ Drip-Feed 50 URLs/Day</option>
                  <option value="WebSub RSS Hub">Register Atom XML Feed with Google WebSub Hub</option>
                </select>
              </div>

            </div>

            {/* Test Simulation Trigger */}
            <div className="pt-2 flex flex-col items-center space-y-3">
              <button
                onClick={handleSimulateZap}
                disabled={isSimulatingZap}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition flex items-center space-x-2"
              >
                <RotateCw className={`w-4 h-4 text-slate-950 ${isSimulatingZap ? 'animate-spin' : ''}`} />
                <span>{isSimulatingZap ? 'Simulating Automation Workflow...' : 'Test Automation Workflow'}</span>
              </button>

              {zapOutput && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <span>{zapOutput}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Live Console Sandbox */}
      <section className="max-w-5xl mx-auto px-4">
        <UrlSubmitter
          onSubmit={onSubmitDemo}
          isSubmitting={isSubmitting}
          hasGoogleCreds={false}
          onOpenCredentials={onOpenAuth}
        />
        <LiveMonitor job={activeJob} />
      </section>

      {/* 4. Speed & Performance Comparison Matrix */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            PERFORMANCE BENCHMARK MATRIX
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Why SilverStone Indexer Leads the Market
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 md:p-8 shadow-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase">
              <tr>
                <th className="p-4">Feature / Metric</th>
                <th className="p-4 text-slate-500">Manual Submission</th>
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
                <td className="p-4 font-bold text-white">Pre-Submission AI Quality Audit</td>
                <td className="p-4 text-slate-500">None</td>
                <td className="p-4 text-slate-500">None (Spends credits on 404s)</td>
                <td className="p-4 text-slate-200 font-bold">Caffeine Pre-Flight Auditor</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Live Index Status Verification</td>
                <td className="p-4 text-slate-500">Manual GSC Inspect</td>
                <td className="p-4 text-slate-500">None</td>
                <td className="p-4 text-slate-200 font-bold">Live Status Inspector & Tracker</td>
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

      {/* 5. Integration Ecosystem Grid */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            CONNECTIVITY ECOSYSTEM
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Built for Modern Web Frameworks & CMS Platforms
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

      {/* 6. Pricing Tier Preview */}
      <section className="max-w-5xl mx-auto px-4 space-y-8 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            FLEXIBLE PLANS FOR TEAMS & AGENCIES
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Transparent Pricing with Zero Hidden Fees
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase">FREE TIER</span>
            <h3 className="text-3xl font-black text-white font-mono">$0 <span className="text-xs text-slate-500 font-normal">/mo</span></h3>
            <p className="text-xs text-slate-400">10 URLs / Month • 100% Free Forever</p>
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Get Started Free
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-600 space-y-4 relative shadow-2xl">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-slate-200 text-slate-950">
              POPULAR
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase">STARTER PLAN</span>
            <h3 className="text-3xl font-black text-white font-mono">$5 <span className="text-xs text-slate-500 font-normal">/mo</span></h3>
            <p className="text-xs text-slate-400">100 URLs / Month • Full API & Auto-Monitor</p>
            <button
              onClick={onOpenPricing}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition"
            >
              Select Starter Plan
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase">PRO PLAN</span>
            <h3 className="text-3xl font-black text-white font-mono">$15 <span className="text-xs text-slate-500 font-normal">/mo</span></h3>
            <p className="text-xs text-slate-400">500 URLs / Month • Priority Worker Dispatch</p>
            <button
              onClick={onOpenPricing}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Select Pro Plan
            </button>
          </div>
        </div>
      </section>

      {/* 7. Author & Technical SEO Authority Section */}
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

      {/* 8. FAQs */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-extrabold text-white">Everything You Need to Know</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden font-sans">
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
