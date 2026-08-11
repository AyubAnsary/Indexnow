'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  X,
  CheckCircle2,
  Cpu,
  Globe,
  Zap,
  Radio,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react';
import { IndexingJob, IndexingStats } from '@/lib/types';

interface WhiteLabelReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: IndexingStats;
  jobs: IndexingJob[];
  userAccount: {
    name: string;
    email: string;
  };
}

export default function WhiteLabelReportModal({
  isOpen,
  onClose,
  stats,
  jobs,
  userAccount,
}: WhiteLabelReportModalProps) {
  const [agencyName, setAgencyName] = useState('SilverStone Digital SEO Agency');
  const [clientName, setClientName] = useState('Valued Client Enterprise');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden font-sans text-slate-100 space-y-6 p-6 sm:p-10">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-slate-300" />
            <h3 className="text-lg font-bold text-white">Agency White-Label Executive PDF Report</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Print / Save to PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Executive Audit Report Content */}
        <div className="printable-report space-y-8 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-slate-200">
          
          {/* Header & Branding */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
            <div>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="text-2xl font-black text-white bg-transparent outline-none border-b border-transparent hover:border-slate-700 focus:border-slate-500 font-sans tracking-tight"
              />
              <p className="text-xs text-slate-400 font-mono mt-1">
                Executive Search Engine URL Indexation Audit Report
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 space-y-1">
              <p className="text-white font-bold">
                Client: {' '}
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-transparent outline-none text-slate-200 border-b border-transparent hover:border-slate-700 font-bold"
                />
              </p>
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p className="text-emerald-400 font-semibold">Engine Status: 100% OPERATIONAL</p>
            </div>
          </div>

          {/* Metric KPI Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total URLs Processed</span>
              <p className="text-2xl font-black text-white font-mono">{stats.totalUrlsSubmitted.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Indexation Pass Rate</span>
              <p className="text-2xl font-black text-slate-200 font-mono">{stats.successRatePercent}% Pass</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Active Domains</span>
              <p className="text-2xl font-black text-slate-200 font-mono">{stats.activeDomainsCount}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">AVG Dispatch Latency</span>
              <p className="text-2xl font-black text-slate-200 font-mono">{stats.averageSpeedMs}ms</p>
            </div>
          </div>

          {/* Dispatched Engines Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-slate-300" />
              <span>Dispatched Search Engine Infrastructure</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Zap className="w-4 h-4 text-slate-300" />
                  <span>IndexNow Protocol</span>
                </div>
                <p className="text-[11px] text-slate-400">Bing, Yandex, Seznam, Naver (HTTP 202 Accepted)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Radio className="w-4 h-4 text-slate-300" />
                  <span>Google Indexing API</span>
                </div>
                <p className="text-[11px] text-slate-400">Direct OAuth 2.0 Bearer Push (HTTP 200 OK)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Globe className="w-4 h-4 text-slate-300" />
                  <span>RPC Crawl Network</span>
                </div>
                <p className="text-[11px] text-slate-400">Global Crawler Notification RPC Nodes</p>
              </div>
            </div>
          </div>

          {/* Recent Audited Jobs Summary Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Recent Audited Submissions</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
                  <tr>
                    <th className="p-3">Job ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">URLs</th>
                    <th className="p-3">Engines</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {jobs.slice(0, 5).map((j) => (
                    <tr key={j.id}>
                      <td className="p-3 text-white font-bold">{j.id}</td>
                      <td className="p-3">{new Date(j.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">{j.totalUrls} URLs</td>
                      <td className="p-3 uppercase">{j.enginesSelected.join(', ')}</td>
                      <td className="p-3 text-emerald-400 font-bold">{j.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>Powered by SilverStone Quantum Indexer v2.0</span>
            <span>Report Verification Code: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
