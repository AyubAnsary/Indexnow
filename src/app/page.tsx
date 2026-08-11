'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import UrlSubmitter from '@/components/UrlSubmitter';
import LiveMonitor from '@/components/LiveMonitor';
import HistoryDashboard from '@/components/HistoryDashboard';
import CredentialsModal from '@/components/CredentialsModal';
import { EngineType, IndexingJob, IndexingStats } from '@/lib/types';
import { Sparkles, ShieldAlert, Zap, Layers, RefreshCw } from 'lucide-react';

export default function Home() {
  const [activeJob, setActiveJob] = useState<IndexingJob | null>(null);
  const [jobsHistory, setJobsHistory] = useState<IndexingJob[]>([]);
  const [stats, setStats] = useState<IndexingStats>({
    totalJobs: 0,
    totalUrlsSubmitted: 0,
    successRatePercent: 100,
    activeDomainsCount: 0,
    averageSpeedMs: 180,
  });
  const [hasGoogleCreds, setHasGoogleCreds] = useState<boolean>(false);
  const [googleClientEmail, setGoogleClientEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState<boolean>(false);

  // Load initial stats & history from API
  const fetchHistoryData = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        setJobsHistory(data.jobs || []);
        if (data.stats) setStats(data.stats);
        setHasGoogleCreds(data.hasGoogleCreds || false);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const fetchCredentialsInfo = async () => {
    try {
      const res = await fetch('/api/credentials');
      const data = await res.json();
      if (data.success) {
        setHasGoogleCreds(data.hasGoogleCreds || false);
        setGoogleClientEmail(data.googleClientEmail || null);
      }
    } catch (err) {
      console.error('Error fetching credentials:', err);
    }
  };

  useEffect(() => {
    fetchHistoryData();
    fetchCredentialsInfo();

    // Setup Server-Sent Events (SSE) Real-Time Telemetry Stream
    const eventSource = new EventSource('/api/index/stream');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'job_update' && payload.job) {
          const updatedJob: IndexingJob = payload.job;

          // If job matches current active job or is new, update active state
          setActiveJob((prev) => {
            if (!prev || prev.id === updatedJob.id) {
              return updatedJob;
            }
            return prev;
          });

          // Refresh history and metrics
          fetchHistoryData();
        }
      } catch {
        // Heartbeat or parse skip
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Submit Handler
  const handleSubmission = async (data: {
    rawInput: string;
    engines: EngineType[];
    performPreflight: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: data.rawInput,
          engines: data.engines,
          options: { performPreflight: data.performPreflight },
        }),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit URLs.');
      }

      if (result.job) {
        setActiveJob(result.job);
      }

      await fetchHistoryData();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Glassmorphic Navigation Header */}
      <Header
        onOpenCredentials={() => setIsCredentialsModalOpen(true)}
        hasGoogleCreds={hasGoogleCreds}
        activeJobsCount={activeJob && activeJob.status === 'submitting' ? 1 : 0}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Hero Banner Section */}
        <section className="relative text-center py-6 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 shadow-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Instant IndexNow + Google Crawl Broadcast Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Index Any URL across <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              All Search Engines
            </span>{' '}
            Instantly.
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            No waiting for weeks. Paste your website URLs or XML sitemap to trigger immediate crawling by Bing, Yandex, Google, Naver, and Seznam.
          </p>
        </section>

        {/* Console & Monitor Grid */}
        <section className="space-y-8">
          <UrlSubmitter
            onSubmit={handleSubmission}
            isSubmitting={isSubmitting}
            hasGoogleCreds={hasGoogleCreds}
            onOpenCredentials={() => setIsCredentialsModalOpen(true)}
          />

          <LiveMonitor job={activeJob} />
        </section>

        {/* Metrics & History Section */}
        <section className="pt-6">
          <HistoryDashboard stats={stats} jobs={jobsHistory} />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} IndexPulse. Powered by IndexNow Protocol & Google Indexing API.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>IndexNow Standard v1.0</span>
            <span>•</span>
            <span>Open Source Community Engine</span>
          </div>
        </div>
      </footer>

      {/* Service Account Modal */}
      <CredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onSaved={fetchCredentialsInfo}
        hasGoogleCreds={hasGoogleCreds}
        googleClientEmail={googleClientEmail}
      />
    </div>
  );
}
