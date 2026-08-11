'use client';

import React, { useState } from 'react';
import {
  Send,
  Zap,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  Radio,
  SlidersHorizontal,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { EngineType } from '@/lib/types';

interface UrlSubmitterProps {
  onSubmit: (data: {
    rawInput: string;
    engines: EngineType[];
    performPreflight: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
  hasGoogleCreds: boolean;
  onOpenCredentials: () => void;
}

export default function UrlSubmitter({
  onSubmit,
  isSubmitting,
  hasGoogleCreds,
  onOpenCredentials,
}: UrlSubmitterProps) {
  const [rawInput, setRawInput] = useState<string>('');
  const [selectedEngines, setSelectedEngines] = useState<EngineType[]>([
    'indexnow',
    'ping',
  ]);
  const [performPreflight, setPerformPreflight] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleEngine = (engine: EngineType) => {
    if (engine === 'google_api' && !hasGoogleCreds) {
      onOpenCredentials();
      return;
    }

    if (selectedEngines.includes(engine)) {
      if (selectedEngines.length === 1) return; // Must have at least 1 engine
      setSelectedEngines(selectedEngines.filter((e) => e !== engine));
    } else {
      setSelectedEngines([...selectedEngines, engine]);
    }
  };

  const handleQuickPreset = (preset: 'sample' | 'sitemap') => {
    if (preset === 'sample') {
      setRawInput(
        `https://example.com/blog/latest-news\nhttps://example.com/products/new-arrival\nhttps://example.com/about-us`
      );
    } else if (preset === 'sitemap') {
      setRawInput(`https://example.com/sitemap.xml`);
    }
    setErrorMsg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawInput(content);
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim()) {
      setErrorMsg('Please paste at least one valid URL or sitemap link.');
      return;
    }

    setErrorMsg(null);
    try {
      await onSubmit({
        rawInput,
        engines: selectedEngines,
        performPreflight,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setErrorMsg(msg);
    }
  };

  const lineCount = rawInput
    ? rawInput.split(/[\r\n]+/).filter((line) => line.trim().length > 0).length
    : 0;

  return (
    <div className="relative group">
      {/* Background Metallic Chrome Glow Effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 via-zinc-400 to-slate-300 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-6 md:p-8 shadow-2xl shadow-slate-950">
        
        {/* Console Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>Submit URLs for Instant Indexing</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                100% FREE
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Paste URLs or your XML sitemap link below. The engine automatically validates, formats, and broadcasts changes to search crawlers.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Presets:</span>
            <button
              type="button"
              onClick={() => handleQuickPreset('sample')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition"
            >
              + Sample URLs
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('sitemap')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition"
            >
              + XML Sitemap
            </button>
            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition flex items-center space-x-1">
              <Upload className="w-3.5 h-3.5 text-slate-300" />
              <span>Import File</span>
              <input
                type="file"
                accept=".txt,.csv,.xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Textarea Input */}
          <div className="relative">
            <textarea
              value={rawInput}
              onChange={(e) => {
                setRawInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder={`Paste your URLs here (one per line, comma-separated, or paste a sitemap link)...\n\nExample:\nhttps://yourdomain.com/blog/new-post\nhttps://yourdomain.com/products/item-123\nhttps://yourdomain.com/sitemap.xml`}
              rows={6}
              className="w-full rounded-xl bg-slate-950/90 border border-slate-800 focus:border-slate-400/80 focus:ring-4 focus:ring-slate-400/10 text-slate-100 placeholder-slate-500 p-4 font-mono text-sm leading-relaxed transition-all shadow-inner outline-none resize-y"
            ></textarea>

            {/* URL Counter Pill */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-md">
              <FileText className="w-3.5 h-3.5 text-slate-300" />
              <span>{lineCount} {lineCount === 1 ? 'URL' : 'URLs'} Detected</span>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Engine Selection Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* IndexNow Toggle */}
            <div
              onClick={() => toggleEngine('indexnow')}
              className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                selectedEngines.includes('indexnow')
                  ? 'bg-slate-900 border-slate-500/80 shadow-lg shadow-slate-400/10 ring-1 ring-slate-400/30'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-white">IndexNow Protocol</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEngines.includes('indexnow')}
                  onChange={() => {}}
                  className="rounded border-slate-700 text-slate-300 focus:ring-slate-500/20 bg-slate-900"
                />
              </div>
              <p className="text-xs text-slate-400">
                Instant broadcast to Bing, Yandex, Seznam & Naver crawlers. Zero configuration required.
              </p>
            </div>

            {/* Ping Network Toggle */}
            <div
              onClick={() => toggleEngine('ping')}
              className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                selectedEngines.includes('ping')
                  ? 'bg-slate-900 border-slate-500/80 shadow-lg shadow-slate-400/10 ring-1 ring-slate-400/30'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-white">Global Ping Network</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEngines.includes('ping')}
                  onChange={() => {}}
                  className="rounded border-slate-700 text-slate-300 focus:ring-slate-500/20 bg-slate-900"
                />
              </div>
              <p className="text-xs text-slate-400">
                Notifies Googlebot & Bing sitemap notification RPC endpoints instantly.
              </p>
            </div>

            {/* Google Indexing API Toggle */}
            <div
              onClick={() => toggleEngine('google_api')}
              className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                selectedEngines.includes('google_api')
                  ? 'bg-slate-900 border-slate-500/80 shadow-lg shadow-slate-400/10 ring-1 ring-slate-400/30'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-white">Google Indexing API</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEngines.includes('google_api')}
                  onChange={() => {}}
                  className="rounded border-slate-700 text-slate-300 focus:ring-slate-500/20 bg-slate-900"
                />
              </div>
              <p className="text-xs text-slate-400">
                Direct push to Google Search index. {hasGoogleCreds ? 'Key Connected' : '(Click to connect free key)'}
              </p>
            </div>
          </div>

          {/* Additional Options & Submit Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            {/* Preflight Check Switch */}
            <label className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={performPreflight}
                onChange={(e) => setPerformPreflight(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-slate-300 focus:ring-slate-500/20"
              />
              <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                Run Pre-flight 200 OK HTTP Check before submitting
              </span>
            </label>

            {/* Metallic Liquid Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || lineCount === 0}
              className={`relative group overflow-hidden px-8 py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 ${
                isSubmitting || lineCount === 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 hover:from-white hover:to-slate-300 shadow-slate-400/25 hover:shadow-slate-400/40 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  <span>Broadcasting Engine...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-1" />
                  <span>Start Instant Indexing ({lineCount})</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
