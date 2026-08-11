'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Cpu,
} from 'lucide-react';
import { IndexingJob, UrlSubmissionItem } from '@/lib/types';
import { LiveInspectionResult } from '@/lib/index-inspector';

interface UrlTrackerTabProps {
  jobs: IndexingJob[];
  onReIndexUrls: (urls: string[]) => Promise<void>;
}

interface TrackedUrlRecord {
  jobId: string;
  url: string;
  domain: string;
  submittedAt: string;
  httpStatus?: number;
  engineStatus: string;
  liveStatus: 'INDEXED_AND_LIVE' | 'CRAWLED_PENDING_INDEX' | 'NOT_INDEXED';
  lastInspectedAt?: string;
  inspectionDetails?: LiveInspectionResult;
}

export default function UrlTrackerTab({ jobs, onReIndexUrls }: UrlTrackerTabProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'pending' | 'unindexed'>('all');
  const [inspectingUrl, setInspectingUrl] = useState<string | null>(null);
  const [inspectionCache, setInspectionCache] = useState<Record<string, LiveInspectionResult>>({});
  const [isReIndexing, setIsReIndexing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all individual URLs across all jobs
  const allTrackedUrls: TrackedUrlRecord[] = jobs.flatMap((job) =>
    job.urls.map((item) => {
      const cached = inspectionCache[item.url];
      let liveStatus: 'INDEXED_AND_LIVE' | 'CRAWLED_PENDING_INDEX' | 'NOT_INDEXED' = 'INDEXED_AND_LIVE';

      if (cached) {
        liveStatus = cached.status;
      } else if (item.status === 'failed') {
        liveStatus = 'NOT_INDEXED';
      } else if (item.status === 'pending' || item.status === 'checking_http') {
        liveStatus = 'CRAWLED_PENDING_INDEX';
      }

      return {
        jobId: job.id,
        url: item.url,
        domain: item.domain,
        submittedAt: item.submittedAt || job.createdAt,
        httpStatus: item.httpStatus || 200,
        engineStatus: item.status,
        liveStatus,
        lastInspectedAt: cached?.lastCrawledAt,
        inspectionDetails: cached,
      };
    })
  );

  // Filtered list
  const filteredUrls = allTrackedUrls.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'live') return item.liveStatus === 'INDEXED_AND_LIVE';
    if (statusFilter === 'pending') return item.liveStatus === 'CRAWLED_PENDING_INDEX';
    if (statusFilter === 'unindexed') return item.liveStatus === 'NOT_INDEXED';
    return true;
  });

  const unindexedCount = allTrackedUrls.filter((u) => u.liveStatus === 'NOT_INDEXED').length;
  const liveCount = allTrackedUrls.filter((u) => u.liveStatus === 'INDEXED_AND_LIVE').length;
  const pendingCount = allTrackedUrls.filter((u) => u.liveStatus === 'CRAWLED_PENDING_INDEX').length;

  // Single URL Live Status Check
  const handleInspectUrl = async (targetUrl: string) => {
    setInspectingUrl(targetUrl);
    try {
      const res = await fetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (data.success && data.inspection) {
        setInspectionCache((prev) => ({ ...prev, [targetUrl]: data.inspection }));
      }
    } finally {
      setInspectingUrl(null);
    }
  };

  // Bulk Re-Index Unindexed URLs
  const handleBulkReIndex = async () => {
    const unindexedUrls = allTrackedUrls.filter((u) => u.liveStatus === 'NOT_INDEXED').map((u) => u.url);
    if (unindexedUrls.length === 0) return;

    setIsReIndexing(true);
    try {
      await onReIndexUrls(unindexedUrls);
    } finally {
      setIsReIndexing(false);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Search className="w-5 h-5 text-slate-300" />
            <span>Master Submitted URL Directory & Live Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Track live indexation status indicators across Google, Bing, and Yandex with on-demand inspection.
          </p>
        </div>

        {unindexedCount > 0 && (
          <button
            onClick={handleBulkReIndex}
            disabled={isReIndexing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition flex items-center space-x-1.5"
          >
            <RotateCw className={`w-4 h-4 text-slate-950 ${isReIndexing ? 'animate-spin' : ''}`} />
            <span>{isReIndexing ? 'Re-Indexing Batch...' : `Bulk Re-Index Unindexed (${unindexedCount})`}</span>
          </button>
        )}
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Total Tracked URLs</span>
          <p className="text-xl font-bold text-white">{allTrackedUrls.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
            <span>Indexed & Live</span>
          </span>
          <p className="text-xl font-bold text-slate-200">{liveCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Crawling / Processing</span>
          </span>
          <p className="text-xl font-bold text-slate-300">{pendingCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Unindexed / Blocked</span>
          </span>
          <p className="text-xl font-bold text-rose-400">{unindexedCount}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All URLs ({allTrackedUrls.length})
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'live'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Indexed & Live ({liveCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'pending'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Processing ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('unindexed')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'unindexed'
                ? 'bg-slate-800 text-rose-300 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unindexed ({unindexedCount})
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by URL or domain..."
          className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-slate-600"
        />
      </div>

      {/* Master Submitted URLs Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
            <tr>
              <th className="p-4">Target URL</th>
              <th className="p-4">Domain</th>
              <th className="p-4">Live Index Status</th>
              <th className="p-4">Submitted Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filteredUrls.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No submitted URLs found matching the current filter.
                </td>
              </tr>
            ) : (
              filteredUrls.map((item, idx) => (
                <tr key={`${item.jobId}_${idx}`} className="hover:bg-slate-900/60 transition">
                  
                  {/* URL */}
                  <td className="p-4 max-w-md truncate font-semibold text-white">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center space-x-1.5 truncate"
                    >
                      <span className="truncate">{item.url}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    </a>
                  </td>

                  {/* Domain */}
                  <td className="p-4 text-slate-400">{item.domain}</td>

                  {/* Live Status Badge */}
                  <td className="p-4">
                    {item.liveStatus === 'INDEXED_AND_LIVE' && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                        <span>Indexed & Live</span>
                      </span>
                    )}
                    {item.liveStatus === 'CRAWLED_PENDING_INDEX' && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Processing Crawl</span>
                      </span>
                    )}
                    {item.liveStatus === 'NOT_INDEXED' && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Unindexed / Blocked</span>
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-slate-400">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleInspectUrl(item.url)}
                      disabled={inspectingUrl === item.url}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition inline-flex items-center space-x-1"
                    >
                      <Search className={`w-3.5 h-3.5 text-slate-300 ${inspectingUrl === item.url ? 'animate-spin' : ''}`} />
                      <span>{inspectingUrl === item.url ? 'Inspecting...' : 'Check Live Status'}</span>
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
