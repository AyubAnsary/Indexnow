'use client';

import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Folder } from 'lucide-react';
import { IndexingJob } from '@/lib/types';

interface CohortAnalyticsProps {
  jobs: IndexingJob[];
}

interface CohortGroup {
  pattern: string;
  totalCount: number;
  indexedCount: number;
  unindexedCount: number;
  passRatePercent: number;
}

export default function CohortAnalytics({ jobs }: CohortAnalyticsProps) {
  const allUrls = jobs.flatMap((j) => j.urls);

  // Group URLs by path structural cohort
  const cohortMap: Record<string, { total: number; indexed: number; unindexed: number }> = {};

  for (const item of allUrls) {
    try {
      const urlObj = new URL(item.url);
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);

      let pattern = '/';
      if (pathSegments.length > 0) {
        pattern = `/${pathSegments[0]}/*`;
      }

      if (!cohortMap[pattern]) {
        cohortMap[pattern] = { total: 0, indexed: 0, unindexed: 0 };
      }

      cohortMap[pattern].total += 1;
      if (item.status === 'failed') {
        cohortMap[pattern].unindexed += 1;
      } else {
        cohortMap[pattern].indexed += 1;
      }
    } catch {}
  }

  const cohorts: CohortGroup[] = Object.entries(cohortMap).map(([pattern, counts]) => ({
    pattern,
    totalCount: counts.total,
    indexedCount: counts.indexed,
    unindexedCount: counts.unindexed,
    passRatePercent: counts.total > 0 ? Math.round((counts.indexed / counts.total) * 100) : 0,
  }));

  cohorts.sort((a, b) => b.totalCount - a.totalCount);

  return (
    <div className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-slate-300" />
            <span>Programmatic SEO (pSEO) Template Cohort Analytics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Grouped analysis of URL path cohorts to identify failing templates and optimize crawl patterns.
          </p>
        </div>
      </div>

      {cohorts.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 font-mono">
          No URL submissions analyzed yet. Submit URLs to view Cohort Analytics!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cohorts.map((c) => (
            <div key={c.pattern} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <Folder className="w-4 h-4 text-slate-400" />
                  <span>{c.pattern}</span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    c.passRatePercent >= 80
                      ? 'bg-slate-800 text-slate-200 border border-slate-700'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {c.passRatePercent}% Pass
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    c.passRatePercent >= 80 ? 'bg-gradient-to-r from-slate-300 to-slate-100' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(c.passRatePercent, 6)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <div>
                  <span className="block text-slate-600">TOTAL</span>
                  <span className="text-white font-bold">{c.totalCount} URLs</span>
                </div>
                <div>
                  <span className="block text-slate-600">INDEXED</span>
                  <span className="text-slate-200 font-bold">{c.indexedCount} URLs</span>
                </div>
                <div>
                  <span className="block text-slate-600">UNINDEXED</span>
                  <span className="text-rose-400 font-bold">{c.unindexedCount} URLs</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
