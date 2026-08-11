'use client';

import React, { useState } from 'react';
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  TrendingUp,
  RotateCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { DomainCoverageReport } from '@/lib/domain-discovery';

interface DomainAutoIndexerTabProps {
  onRefreshData: () => void;
}

export default function DomainAutoIndexerTab({ onRefreshData }: DomainAutoIndexerTabProps) {
  const [domainInput, setDomainInput] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [report, setReport] = useState<DomainCoverageReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isActivatingPlan, setIsActivatingPlan] = useState(false);
  const [activatedMsg, setActivatedMsg] = useState<string | null>(null);

  // Auto-Discover & Audit Domain
  const handleDiscoverDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setIsDiscovering(true);
    setErrorMsg(null);
    setReport(null);
    setActivatedMsg(null);

    try {
      const res = await fetch('/api/domain/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainInput.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Domain discovery failed');
      setReport(data.report);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error discovering domain');
    } finally {
      setIsDiscovering(false);
    }
  };

  // Activate Zero-Touch Drip Plan
  const handleActivateAutoPlan = async () => {
    if (!report || report.unindexedUrls.length === 0) return;

    setIsActivatingPlan(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/domain/auto-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unindexedUrls: report.unindexedUrls,
          dailyRate: report.suggestedDailyRate,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Activation failed');
      setActivatedMsg(data.message);
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error activating plan');
    } finally {
      setIsActivatingPlan(false);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-slate-300" />
            <span>Automated Domain Auto-Pilot & Zero-Touch Drip Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Submit your domain. SilverStone auto-fetches all site URLs, audits index coverage %, and creates an automated daily drip plan.
          </p>
        </div>
      </div>

      {/* Domain Discovery Input Form */}
      <form onSubmit={handleDiscoverDomain} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Enter Target Domain</h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="e.g. ayubansary.com or https://yourdomain.com"
            required
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            disabled={isDiscovering}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition flex items-center space-x-2 justify-center"
          >
            <Search className={`w-4 h-4 text-slate-950 ${isDiscovering ? 'animate-spin' : ''}`} />
            <span>{isDiscovering ? 'Auto-Discovering Site...' : 'Discover & Audit Index Coverage'}</span>
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      {activatedMsg && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-slate-300" />
          <span>{activatedMsg}</span>
        </div>
      )}

      {/* Coverage Report Card */}
      {report && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 animate-fade-in">
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase">AUDITED DOMAIN</span>
              <h4 className="text-2xl font-extrabold text-white font-mono">{report.domain}</h4>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
              {report.coveragePercent}% Index Coverage
            </span>
          </div>

          {/* Visual Coverage Progress Gauge */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Coverage Ratio ({report.indexedCount} / {report.totalDiscovered} URLs)</span>
              <span className="text-white font-bold">{report.coveragePercent}%</span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-slate-300 via-slate-100 to-zinc-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(report.coveragePercent, 4)}%` }}
              ></div>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">TOTAL DISCOVERED</span>
              <p className="text-xl font-bold text-white">{report.totalDiscovered} URLs</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                <span>INDEXED & LIVE</span>
              </span>
              <p className="text-xl font-bold text-slate-200">{report.indexedCount} URLs</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>UNINDEXED (TO INJECT)</span>
              </span>
              <p className="text-xl font-bold text-rose-400">{report.unindexedCount} URLs</p>
            </div>
          </div>

          {/* Automated Safe Drip Plan Action Card */}
          {report.unindexedCount > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-slate-300" />
                  <span className="font-bold text-white text-sm">Automated Zero-Touch Drip Plan Ready</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  ~{report.estimatedDaysToComplete} Days Completion
                </span>
              </div>

              <p className="text-slate-400 leading-relaxed text-[11px]">
                SilverStone has prepared an optimal daily release velocity of <strong className="text-slate-200">{report.suggestedDailyRate} URLs/day</strong> to safely inject your {report.unindexedCount} unindexed URLs into Google & IndexNow without triggering spam throttling.
              </p>

              <button
                onClick={handleActivateAutoPlan}
                disabled={isActivatingPlan}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-lg hover:from-white hover:to-slate-300 transition flex items-center justify-center space-x-2"
              >
                <Play className={`w-4 h-4 text-slate-950 ${isActivatingPlan ? 'animate-spin' : ''}`} />
                <span>{isActivatingPlan ? 'Activating Auto-Pilot...' : `Activate Zero-Touch Auto-Indexing (${report.unindexedCount} URLs)`}</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
