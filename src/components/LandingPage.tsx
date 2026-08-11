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
  const [activeTab, setActiveTab] = useState<'sitemap' | 'caffeine' | 'drip' | 'security'>('sitemap');

  // Zapier Interactive Node State
  const [triggerApp, setTriggerApp] = useState('WordPress');
  const [actionApp, setActionApp] = useState('Google Indexing API');
  const [isSimulatingZap, setIsSimulatingZap] = useState(false);
  const [zapOutput, setZapOutput] = useState<string | null>(null);
  const [heroEmail, setHeroEmail] = useState('');

  const handleSimulateZap = () => {
    setIsSimulatingZap(true);
    setZapOutput(null);
    setTimeout(() => {
      setIsSimulatingZap(false);
      setZapOutput(`Zap Triggered! 100% verified broadcast from ${triggerApp} to ${actionApp} in 380ms.`);
    }, 1000);
  };

  const appsList = [
    { name: 'Google Search Console', category: 'Search Engines', badge: 'Official API' },
    { name: 'IndexNow Protocol', category: 'Bing & Yandex', badge: 'Instant Push' },
    { name: 'WordPress', category: 'CMS Platform', badge: 'Auto-Sync' },
    { name: 'Shopify', category: 'E-Commerce', badge: 'Product Drip' },
    { name: 'Webflow', category: 'CMS Platform', badge: 'Webhook' },
    { name: 'Next.js & React', category: 'JS Framework', badge: 'SSR Engine' },
    { name: 'Ghost CMS', category: 'Publishing', badge: 'RSS Hub' },
    { name: 'Zapier REST API', category: 'API Keys', badge: 'Bearer sk_...' },
  ];

  const automationRecipes = [
    {
      title: 'Publish in WordPress ➔ Broadcast to Google & IndexNow',
      desc: 'Automatically run Caffeine audit and push new blog posts the second you hit publish.',
      trigger: 'WordPress',
      action: 'Google API & IndexNow',
      runs: '12,450 runs this week',
    },
    {
      title: 'Product added in Shopify ➔ Drip-Feed to Bing & Yandex',
      desc: 'Purge dead pages and release 50 product URLs/day to protect crawl budget.',
      trigger: 'Shopify',
      action: 'Drip Scheduler',
      runs: '48,200 runs this week',
    },
    {
      title: 'XML Sitemap Updated ➔ Auto-Purge 404s & Index Now',
      desc: 'Background daemon sweeps sitemap.xml every 5 mins and indexes clean pages.',
      trigger: 'XML Sitemap',
      action: 'Sitemap XML Purger',
      runs: '89,100 runs this week',
    },
    {
      title: 'REST API Key Trigger ➔ WebSub Atom RSS Broadcast',
      desc: 'Developers call POST /api/v1/index to notify Google WebSub hubs in milliseconds.',
      trigger: 'REST API (sk_...)',
      action: 'WebSub RSS Hub',
      runs: '154,000 runs this week',
    },
  ];

  const faqs = [
    {
      q: 'How does SilverStone compare to Zapier for search engine indexing?',
      a: 'Zapier is a general automation tool, whereas SilverStone is an enterprise indexing platform built specifically for search crawlers. SilverStone connects your CMS or sitemap directly to Google Indexing API, IndexNow, and WebSub hubs with AI Caffeine pre-audits and zero code.',
    },
    {
      q: 'Do I need to upload any verification key files to my website server?',
      a: 'No! SilverStone automatically hosts the IndexNow key proxy (/[key].txt) on our engine infrastructure. You simply paste your URLs or sitemap and our platform handles protocol verification transparently.',
    },
    {
      q: 'Is indexing automation completely safe for my website?',
      a: 'Yes! SilverStone utilizes safe drip velocity scheduling (e.g., 50–250 URLs/day) to prevent search engine spam filter triggers and optimize crawl budget.',
    },
    {
      q: 'Who built SilverStone Indexer?',
      a: 'SilverStone Indexer was architected by Ayub Ansary (ayubansary.com), an Enterprise Technical SEO Consultant & Software Engineer specializing in search crawling infrastructure.',
    },
  ];

  return (
    <div className="space-y-24 py-4 font-sans text-slate-100 selection:bg-slate-300 selection:text-slate-950">
      
      {/* ⚡ 1. ZAPIER HERO FOLD (SPLIT 2-COLUMN CLONE LAYOUT) */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy & Work Email Signup Form */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-200"></span>
              </span>
              <span>AUTOMATE WITHOUT LIMITS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Automate your <br />
              <span className="bg-gradient-to-r from-slate-100 via-zinc-200 to-slate-400 bg-clip-text text-transparent">
                search indexation
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Turn manual URL indexing into automated workflows. Connect WordPress, Shopify, or XML sitemaps directly to Google, Bing & Yandex in minutes—no code required.
            </p>

            {/* Zapier-Style Work Email Signup Input Box */}
            <div className="pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onOpenAuth();
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg"
              >
                <input
                  type="email"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  placeholder="Enter your work email..."
                  required
                  className="flex-1 px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-slate-500 shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-xl hover:from-white hover:to-slate-300 transition flex items-center justify-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </form>

              <p className="text-[11px] font-mono text-slate-400 mt-2.5 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                <span>Free forever for 10 URLs/mo • No credit card required</span>
              </p>
            </div>

          </div>

          {/* Right Column: Zapier Interactive Workflow Canvas Card */}
          <div className="lg:col-span-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 via-zinc-400 to-slate-300 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

              <div className="relative rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-slate-300" />
                    <span className="font-extrabold text-white text-sm font-mono">Create a Custom Zapier Index Zap</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    LIVE CANVAS
                  </span>
                </div>

                {/* Node 1: Trigger App */}
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
                    <option value="WordPress">New Post Published in WordPress</option>
                    <option value="Shopify">New Product Added to Shopify</option>
                    <option value="XML Sitemap">Sitemap XML Updated (/sitemap.xml)</option>
                    <option value="Developer REST API">Webhook Received via REST API Key</option>
                  </select>
                </div>

                {/* Connection Connector Arrow */}
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>

                {/* Node 2: Action App */}
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

                {/* Test Simulation Trigger Button */}
                <div className="pt-2 space-y-3 text-center">
                  <button
                    onClick={handleSimulateZap}
                    disabled={isSimulatingZap}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-lg hover:from-white hover:to-slate-300 transition flex items-center justify-center space-x-2"
                  >
                    <RotateCw className={`w-4 h-4 text-slate-950 ${isSimulatingZap ? 'animate-spin' : ''}`} />
                    <span>{isSimulatingZap ? 'Executing Zap Workflow...' : `Publish & Run Zap (${triggerApp} ➔ ${actionApp})`}</span>
                  </button>

                  {zapOutput && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center space-x-2 animate-fade-in text-left">
                      <CheckCircle2 className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      <span>{zapOutput}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ⚡ 2. ZAPIER APP ECOSYSTEM MARQUEE LOGO TICKER */}
      <section className="border-y border-slate-900 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            CONNECTS WITH YOUR FAVORITE CMS & SEARCH PLATFORMS
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-2">
            {appsList.map((app, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1 font-mono">
                <span className="text-xs font-bold text-white block truncate">{app.name}</span>
                <span className="text-[9px] text-slate-400 block">{app.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚡ 3. ZAPIER "WHAT CAN YOU AUTOMATE?" TABBED FEATURE ENGINE */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            END-TO-END INDEXING AUTOMATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything you need to automate search engine crawling
          </h2>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center space-x-2 overflow-x-auto border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-5 py-3 rounded-xl font-bold text-xs font-mono transition ${
              activeTab === 'sitemap'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Zero-Touch Sitemaps
          </button>
          <button
            onClick={() => setActiveTab('caffeine')}
            className={`px-5 py-3 rounded-xl font-bold text-xs font-mono transition ${
              activeTab === 'caffeine'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Pre-Flight Audit
          </button>
          <button
            onClick={() => setActiveTab('drip')}
            className={`px-5 py-3 rounded-xl font-bold text-xs font-mono transition ${
              activeTab === 'drip'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Smart Drip Scheduler
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-3 rounded-xl font-bold text-xs font-mono transition ${
              activeTab === 'security'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anti-Group Buy Lock
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-8 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 shadow-2xl font-mono text-xs text-slate-300">
          {activeTab === 'sitemap' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  AUTONOMOUS CRAWLER DAEMON
                </span>
                <h3 className="text-2xl font-bold text-white">Continuous Sitemap XML Auto-Discovery</h3>
                <p className="text-slate-400 leading-relaxed">
                  Register your sitemap.xml URL once. Our 24/7 background worker sweeps your site every 5 minutes, discovers new pages, and submits them to Google and IndexNow hands-free.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Status: Sweeping sitemap.xml</span>
                  <span className="text-slate-200 font-bold">24/7 Active</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-[11px]">
                  ✓ Discovered 14 new URLs ➔ Auto-broadcasted to IndexNow
                </div>
              </div>
            </div>
          )}

          {activeTab === 'caffeine' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  PRE-FLIGHT INTELLIGENCE
                </span>
                <h3 className="text-2xl font-bold text-white">Caffeine Indexability Pre-Audit</h3>
                <p className="text-slate-400 leading-relaxed">
                  Simulate Googlebot's renderer before spending quota. Checks HTTP 200 OK status, TTFB response latency, noindex meta tags, and rel="canonical" alignment.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Audit Result: 98/100 Health Score</span>
                  <span className="text-slate-200 font-bold">PASS</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-[11px]">
                  ✓ HTTP 200 OK • TTFB: 210ms • Robots: Indexable • Canonicals: Matched
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drip' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  SPAM FILTER PROTECTION
                </span>
                <h3 className="text-2xl font-bold text-white">Staged Drip Release Velocity</h3>
                <p className="text-slate-400 leading-relaxed">
                  Submitting 10,000 URLs at once triggers Google spam rate throttling. SilverStone drip-feeds daily batches (50–250 URLs/day) to simulate natural publishing growth.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Daily Drip Queue: 50 URLs / Day</span>
                  <span className="text-slate-200 font-bold">In Progress</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-[11px]">
                  🌊 Released Batch #4 (50 URLs) ➔ 950 URLs remaining in queue
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  ANTI-GROUP BUY LOCK
                </span>
                <h3 className="text-2xl font-bold text-white">IP + User-Agent Fingerprint Binding</h3>
                <p className="text-slate-400 leading-relaxed">
                  Prevents unauthorized cookie-sharing extensions. Session tokens are bound to device fingerprints, revoking exported cookies instantly.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Device Lock: Active Session</span>
                  <span className="text-slate-200 font-bold">ENFORCED</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-[11px]">
                  🔒 SHA-256 Fingerprint Matched • 1 Active Device Session Lock
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ⚡ 4. ZAPIER "POPULAR AUTOMATION RECIPES" CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            POPULAR AUTOMATION TEMPLATES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore ready-to-use indexing Zaps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {automationRecipes.map((recipe, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs hover:border-slate-700 transition group">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950 text-slate-300 border border-slate-800">
                  {recipe.trigger} ➔ {recipe.action}
                </span>
                <span className="text-[10px] text-slate-500">{recipe.runs}</span>
              </div>

              <h3 className="text-base font-bold text-white font-sans group-hover:text-slate-200 transition">
                {recipe.title}
              </h3>

              <p className="text-slate-400 text-xs leading-relaxed">{recipe.desc}</p>

              <button
                onClick={onOpenAuth}
                className="pt-2 text-slate-200 font-bold flex items-center space-x-1 hover:text-white transition"
              >
                <span>Try this Zap</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ⚡ 5. ZAPIER INTERACTIVE SANDBOX CONSOLE */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
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

      {/* ⚡ 6. AUTHOR & ENTERPRISE TECHNICAL SEO CONSULTANT CARD */}
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

      {/* ⚡ 7. FAQS */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
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
