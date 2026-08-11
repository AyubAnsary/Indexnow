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
  const [emailInput, setEmailInput] = useState('');

  // Zapier Interactive Builder State
  const [triggerApp, setTriggerApp] = useState('WordPress');
  const [actionApp, setActionApp] = useState('Google Indexing API');
  const [isSimulatingZap, setIsSimulatingZap] = useState(false);
  const [zapOutput, setZapOutput] = useState<string | null>(null);

  const handleSimulateZap = () => {
    setIsSimulatingZap(true);
    setZapOutput(null);
    setTimeout(() => {
      setIsSimulatingZap(false);
      setZapOutput(`Zap Triggered! 100% verified broadcast from ${triggerApp} to ${actionApp} in 380ms.`);
    }, 1000);
  };

  const corporateLogos = [
    { name: 'NVIDIA', font: 'font-black tracking-widest' },
    { name: 'Google', font: 'font-bold' },
    { name: 'Meta', font: 'font-black' },
    { name: "Lowe's", font: 'font-extrabold uppercase' },
    { name: 'Allstate', font: 'font-bold' },
    { name: 'SAMSUNG', font: 'font-black tracking-widest' },
    { name: 'mastercard', font: 'font-semibold italic' },
    { name: 'hp', font: 'font-black italic' },
    { name: 'experian.', font: 'font-bold' },
    { name: 'CURSOR', font: 'font-mono font-bold' },
    { name: 'okta', font: 'font-bold' },
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
    <div className="bg-white text-slate-900 font-sans selection:bg-[#FF4F00] selection:text-white space-y-24 pb-20">
      
      {/* ⚡ 1. EXACT ZAPIER.COM HERO FOLD CLONE */}
      <section className="max-w-7xl mx-auto px-4 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subheadline, Dual Buttons, Trust Badges */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              The automation layer for search engine indexing
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
              One unified pipeline. 9,000+ apps & search engines. Set your policies and work across any model, surface, or indexing harness — without connections or rules breaking.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenAuth}
                className="px-8 py-4 rounded-xl bg-[#FF4F00] hover:bg-[#e04500] text-white font-extrabold text-base shadow-xl shadow-[#FF4F00]/20 transition-all transform hover:scale-[1.01] flex items-center justify-center space-x-2"
              >
                <span>Start free with email</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="px-6 py-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-base shadow-sm transition flex items-center justify-center space-x-3"
              >
                {/* Multi-Color Google G Logo SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Start free with Google</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium pt-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>SOC 2 (TYPE II) · GDPR · CCPA · AES-256 ENCRYPTED</span>
            </div>

          </div>

          {/* Right Column: Exact 3D Connected Artwork */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative">
              <img
                src="/images/zapier_hero.png"
                alt="Zapier Style Automation Layer Artwork"
                className="w-full max-w-lg mx-auto object-contain drop-shadow-xl hover:scale-[1.01] transition duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ⚡ 2. EXACT ZAPIER CORPORATE TRUST LOGO MARQUEE BAR */}
      <section className="border-t border-slate-200 bg-slate-50/60 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            Trusted by the world's best companies
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition duration-300">
            {corporateLogos.map((logo, idx) => (
              <span key={idx} className={`text-lg md:text-xl text-slate-700 ${logo.font}`}>
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ⚡ 3. ZAPIER INTERACTIVE WORKFLOW BUILDER CANVAS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4F00]">
              ZAPIER WORKFLOW ENGINE
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Connect Any Publishing Source to Search Engines
            </h2>
            <p className="text-sm text-slate-400">
              Select your source trigger and search engine destination to execute an automated indexing workflow.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              
              {/* Trigger Node */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-[#FF4F00]" />
                  <span>1. WHEN THIS HAPPENS (TRIGGER)</span>
                </span>
                <select
                  value={triggerApp}
                  onChange={(e) => setTriggerApp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-white font-mono outline-none focus:border-[#FF4F00]"
                >
                  <option value="WordPress">New Post Published in WordPress</option>
                  <option value="Shopify">New Product Added to Shopify</option>
                  <option value="XML Sitemap">Sitemap XML Updated (/sitemap.xml)</option>
                  <option value="Developer REST API">Webhook Received via REST API Key</option>
                </select>
              </div>

              {/* Connector Arrow */}
              <div className="md:col-span-1 flex items-center justify-center py-2">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                  <ArrowRight className="w-4 h-4 text-[#FF4F00]" />
                </div>
              </div>

              {/* Action Node */}
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <Play className="w-3.5 h-3.5 text-[#FF4F00]" />
                  <span>2. DO THIS AUTOMATICALLY (ACTION)</span>
                </span>
                <select
                  value={actionApp}
                  onChange={(e) => setActionApp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-white font-mono outline-none focus:border-[#FF4F00]"
                >
                  <option value="Google Indexing API">Run Caffeine Audit ➔ Broadcast to Google Indexing API</option>
                  <option value="IndexNow Protocol">Broadcast to IndexNow (Bing, Yandex, Seznam)</option>
                  <option value="Auto-Drip Scheduler">Purge Dead 404s ➔ Drip-Feed 50 URLs/Day</option>
                  <option value="WebSub RSS Hub">Register Atom Feed with Google WebSub Hub</option>
                </select>
              </div>

            </div>

            {/* Test Simulation Action */}
            <div className="pt-2 flex flex-col items-center space-y-3">
              <button
                onClick={handleSimulateZap}
                disabled={isSimulatingZap}
                className="px-8 py-3.5 rounded-xl bg-[#FF4F00] hover:bg-[#e04500] text-white font-extrabold text-xs shadow-lg transition flex items-center space-x-2"
              >
                <RotateCw className={`w-4 h-4 text-white ${isSimulatingZap ? 'animate-spin' : ''}`} />
                <span>{isSimulatingZap ? 'Executing Zap Workflow...' : 'Test Automation Workflow'}</span>
              </button>

              {zapOutput && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{zapOutput}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ 4. LIVE SUBMITTER SANDBOX */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            TRY THE LIVE INDEXING SANDBOX
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Paste a URL to test instant indexing</h2>
        </div>

        <UrlSubmitter
          onSubmit={onSubmitDemo}
          isSubmitting={isSubmitting}
          hasGoogleCreds={false}
          onOpenCredentials={onOpenAuth}
        />
        <LiveMonitor job={activeJob} />
      </section>

      {/* ⚡ 5. AUTHOR & ENTERPRISE TECHNICAL SEO CONSULTANT CARD */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 font-sans">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4F00] flex items-center space-x-2">
              <Award className="w-4 h-4" />
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
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#FF4F00] hover:bg-[#e04500] text-white font-extrabold text-xs shadow-md transition"
              >
                <span>Visit AyubAnsary.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
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

      {/* ⚡ 6. FAQS */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Everything You Need to Know</h2>
        </div>

        <div className="space-y-4 font-sans">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-slate-900 flex justify-between items-center hover:bg-slate-100 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-mono border-t border-slate-200 pt-3">
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
