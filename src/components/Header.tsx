'use client';

import React from 'react';
import { Zap, Key, RefreshCw, Layers, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenCredentials: () => void;
  hasGoogleCreds: boolean;
  activeJobsCount: number;
}

export default function Header({
  onOpenCredentials,
  hasGoogleCreds,
  activeJobsCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60 shadow-lg shadow-indigo-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-400 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                IndexPulse
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO ENGINE v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <span>Universal Search Engine Indexer</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-medium">IndexNow Active</span>
            </p>
          </div>
        </div>

        {/* Engine Status Badges & Controls */}
        <div className="flex items-center space-x-3">
          {/* IndexNow Status Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-slate-300">IndexNow Broadcast:</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>

          {/* Active Job Indicator */}
          {activeJobsCount > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Indexing {activeJobsCount} Active Job(s)...</span>
            </div>
          )}

          {/* Google Credentials Status / Setup Button */}
          <button
            onClick={onOpenCredentials}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border shadow-md ${
              hasGoogleCreds
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-500/40 text-white hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/20 hover:shadow-indigo-600/40'
            }`}
          >
            <Key className="w-4 h-4 text-cyan-400" />
            <span>{hasGoogleCreds ? 'API Key Configured' : 'Connect Google API'}</span>
            {!hasGoogleCreds && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />}
          </button>

        </div>
      </div>
    </header>
  );
}
