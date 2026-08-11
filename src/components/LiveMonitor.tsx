'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertTriangle, XCircle, Info, Sparkles, Activity } from 'lucide-react';
import { IndexingJob, LogEntry } from '@/lib/types';

interface LiveMonitorProps {
  job: IndexingJob | null;
}

export default function LiveMonitor({ job }: LiveMonitorProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of logs terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [job?.logs?.length]);

  if (!job) {
    return (
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 p-6 text-center text-slate-500">
        <Activity className="w-8 h-8 text-slate-700 mx-auto mb-2" />
        <p className="text-xs font-mono">Engine Idle. Submit URLs above to view live execution logs.</p>
      </div>
    );
  }

  const progressPercent = job.totalUrls > 0
    ? Math.round((job.processedCount / job.totalUrls) * 100)
    : 0;

  const isCompleted = job.status === 'success' || job.status === 'partial' || job.status === 'failed';

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800/90 p-6 shadow-2xl overflow-hidden font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white font-mono">Live Execution Console</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                JOB #{job.id.substring(4, 12)}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time Server-Sent Events (SSE) telemetry feed
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Status:</span>
            <span
              className={`font-semibold uppercase tracking-wider ${
                job.status === 'success'
                  ? 'text-emerald-400'
                  : job.status === 'submitting'
                  ? 'text-cyan-400 animate-pulse'
                  : 'text-amber-400'
              }`}
            >
              {job.status}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Pass Rate:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {job.successCount}/{job.totalUrls}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-slate-400">Broadcast Progress</span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCompleted
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-500 animate-pulse'
            }`}
            style={{ width: `${Math.max(progressPercent, 5)}%` }}
          ></div>
        </div>
      </div>

      {/* Terminal Output Log Container */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800/80 font-mono text-xs max-h-64 overflow-y-auto space-y-2 shadow-inner">
        {job.logs.map((log: LogEntry) => (
          <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
            <span className="text-slate-600 select-none">
              [{new Date(log.timestamp).toLocaleTimeString()}]
            </span>

            {/* Level Icon */}
            {log.level === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />}
            {log.level === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />}
            {log.level === 'error' && <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />}
            {log.level === 'info' && <Info className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />}

            {/* Message Body */}
            <span
              className={`${
                log.level === 'success'
                  ? 'text-emerald-300'
                  : log.level === 'warning'
                  ? 'text-amber-300'
                  : log.level === 'error'
                  ? 'text-rose-300'
                  : 'text-slate-300'
              }`}
            >
              {log.message}
            </span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
