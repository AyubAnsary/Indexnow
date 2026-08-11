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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const faqs = [
    {
      q: 'Do website owners need to upload any verification key files to their server?',
      a: 'No! Our engine automatically generates and hosts the IndexNow key on our proxy endpoint. You simply paste your URLs and our system handles 100% of the verification protocol transparently.',
    },
    {
      q: 'Is submitting URLs for search engine indexing completely free?',
      a: 'Yes! Neither Google, Bing, Yandex, nor IndexNow charge any fees for URL submissions. We offer 10 URLs/month completely free forever, with affordable plans starting at $5/month.',
    },
    {
      q: 'How fast do search engine crawlers respond after submission?',
      a: 'IndexNow and Google Indexing APIs trigger instant webhooks. In most cases, search engine crawlers request your URL within seconds to minutes of submission.',
    },
    {
      q: 'Is my Google Cloud Service Account key secure?',
      a: 'Absolutely. Your JSON keys are encrypted at rest using AES-256-GCM encryption in your private vault and are never exposed publicly or shared with third parties.',
    },
  ];

  return (
    <div className="space-y-24 py-4 animate-fade-in">
      
      {/* 1. Google-Inspired Material Hero Section */}
      <section className="relative text-center space-y-8 max-w-5xl mx-auto px-4 pt-4">
        {/* Glow Ambient Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-600/15 to-emerald-400/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Google Material Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold shadow-xl shadow-cyan-950/20 backdrop-blur-xl"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
            Google Indexing API + IndexNow Protocol Engine v2.0
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
        >
          Get Your Web Pages Indexed <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Across All Search Engines
          </span>{' '}
          in Seconds.
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed"
        >
          Stop waiting weeks for search crawlers. Paste your site URLs or XML sitemap link to trigger immediate crawling by Bing, Yandex, Google, Naver, and Seznam.
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
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition transform hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-cyan-200" />
            <span>Start Free — 10 URLs/month</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPricing}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition flex items-center justify-center space-x-2"
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
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free IndexNow Protocol</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Zero Site Setup Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>AES-256 Encrypted Vault</span>
          </div>
        </motion.div>
      </section>

      {/* 2. Interactive Sandbox Preview Console */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Live Interactive Indexer Sandbox</span>
          </h2>
          <p className="text-xs text-slate-400">Test URL parsing and instant broadcasting directly below.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-indigo-500/20 to-emerald-500/30 rounded-3xl blur-xl opacity-40"></div>
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

      {/* 3. Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">WHY CHOOSE INDEXPULSE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built for High Performance & Maximum Crawl Speed</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Everything your engineering and SEO team needs to automate URL indexation across all major search engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 space-y-4 hover:border-cyan-500/40 transition duration-300 shadow-xl">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit border border-cyan-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">IndexNow Instant Broadcast</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Broadcast URL updates to Bing, Yandex, Seznam, and Naver simultaneously via key proxying.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 space-y-4 hover:border-indigo-500/40 transition duration-300 shadow-xl">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Google Cloud API Push</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your Google Service Account JSON key for direct indexing pushes straight into Google’s search index.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 space-y-4 hover:border-emerald-500/40 transition duration-300 shadow-xl">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">XML Sitemap Auto-Extractor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste your sitemap XML link to automatically parse, deduplicate, and index all inner page URLs.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 space-y-4 hover:border-purple-500/40 transition duration-300 shadow-xl">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">SSRF & AES-256 Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise-grade security preventing SSRF attacks and storing API keys with AES-256-GCM encryption.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works (3-Step Pipeline) */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">SIMPLE WORKFLOW</span>
          <h2 className="text-3xl font-extrabold text-white">How IndexPulse Automates Search Crawling</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white">Paste URLs or Sitemap</h3>
            <p className="text-xs text-slate-400">
              Paste raw URLs or your site sitemap link. Our validator cleans and prepares your payload.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white">Engine Verification & Proxy</h3>
            <p className="text-xs text-slate-400">
              Our engine hosts the verification key on our proxy endpoint. No file uploads required on your server.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white">Instant Search Engine Crawl</h3>
            <p className="text-xs text-slate-400">
              Search engine webhooks trigger immediate crawling and status updates in your live telemetry console.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Subscription Pricing Matrix */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">TRANSPARENT PRICING</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Flexible Plans for Individuals & Agencies</h2>
          <p className="text-xs text-slate-400">Start with 10 free URLs every month. Upgrade as your indexing volume grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(PLAN_TIERS).map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition duration-300 ${
                plan.id === 'pro'
                  ? 'bg-slate-900 border-indigo-500/60 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/30'
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

                <div className="mb-6 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-cyan-400 font-bold">
                  {plan.monthlyQuota.toLocaleString()} URLs / month
                </div>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
              >
                {plan.id === 'free' ? 'Start Free' : plan.id === 'custom' ? 'Contact Admin' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about the IndexPulse engine.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center text-sm font-bold text-white hover:text-cyan-300 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
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
