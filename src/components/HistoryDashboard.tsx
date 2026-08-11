'use client';

import React, { useState } from 'react';
import {
  Download,
  Search,
  Globe,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { IndexingJob, IndexingStats, UrlSubmissionItem } from '@/lib/types';

interface HistoryDashboardProps {
  stats: IndexingStats;
  jobs: IndexingJob[];
}

export default function HistoryDashboard({ stats, jobs }: HistoryDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEngine, setFilterEngine] = useState<string>('all');

  // Flatten all URL items from jobs for tabular display
  const allSubmittedUrls: Array<UrlSubmissionItem & { jobId: string; createdAt: string }> = [];
  for (const job of jobs) {
    for (const urlItem of job.urls) {
      allSubmittedUrls.push({
        ...urlItem,
        jobId: job.id,
        createdAt: job.createdAt,
      });
    }
  }

  // Filtered URLs
  const filteredUrls = allSubmittedUrls.filter((item) => {
    const matchesSearch =
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const downloadReport = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jobs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `indexing_report_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      let csvContent = 'data:text/csv;charset=utf-8,URL,Domain,Status,HTTP_Status,Submitted_At\n';
      for (const item of allSubmittedUrls) {
        csvContent += `"${item.url}","${item.domain}","${item.status}","${item.httpStatus || ''}","${item.submittedAt || ''}"\n`;
      }
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `indexing_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total URLs Submitted</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-white font-mono">{stats.totalUrlsSubmitted}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Across {stats.totalJobs} submission jobs</span>
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Indexing Pass Rate</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.successRatePercent}%</h3>
            <p className="text-xs text-slate-400 mt-1">Verified engine acceptance</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Broadcast Speed</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-indigo-300 font-mono">{stats.averageSpeedMs} ms</h3>
            <p className="text-xs text-slate-400 mt-1">Instant API latency</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Host Domains</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-purple-300 font-mono">{stats.activeDomainsCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Unique domains indexed</p>
          </div>
        </div>
      </div>

      {/* History Table Container */}
      <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 shadow-2xl space-y-6">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Indexing Logs & Audit Trail</h3>
            <p className="text-xs text-slate-400">Search and filter all submitted URLs and engine response states</p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search domain or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Export Buttons */}
            <button
              onClick={() => downloadReport('csv')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => downloadReport('json')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Submitted URL</th>
                <th className="py-3.5 px-4 font-semibold">Domain</th>
                <th className="py-3.5 px-4 font-semibold">Pre-flight HTTP</th>
                <th className="py-3.5 px-4 font-semibold">Indexing Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredUrls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    No submitted URLs found.
                  </td>
                </tr>
              ) : (
                filteredUrls.slice(0, 50).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* URL */}
                    <td className="py-3.5 px-4 font-mono max-w-xs truncate text-slate-200">
                      <span title={item.url}>{item.url}</span>
                    </td>

                    {/* Domain */}
                    <td className="py-3.5 px-4 font-mono text-cyan-400">
                      {item.domain}
                    </td>

                    {/* HTTP Pre-flight Code */}
                    <td className="py-3.5 px-4">
                      {item.httpStatus ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            item.httpStatus >= 200 && item.httpStatus < 300
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          HTTP {item.httpStatus}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-mono">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status.includes('success')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span className="capitalize">{item.status.replace('_', ' ')}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
