'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import UrlSubmitter from '@/components/UrlSubmitter';
import LiveMonitor from '@/components/LiveMonitor';
import HistoryDashboard from '@/components/HistoryDashboard';
import CredentialsModal from '@/components/CredentialsModal';
import AuthModal from '@/components/AuthModal';
import PricingModal from '@/components/PricingModal';
import AdminPanelModal from '@/components/AdminPanelModal';
import { EngineType, IndexingJob, IndexingStats, SubscriptionTier } from '@/lib/types';
import { Sparkles, ShieldAlert, Zap, Layers, Lock } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [activeJob, setActiveJob] = useState<IndexingJob | null>(null);
  const [jobsHistory, setJobsHistory] = useState<IndexingJob[]>([]);
  const [stats, setStats] = useState<IndexingStats>({
    totalJobs: 0,
    totalUrlsSubmitted: 0,
    successRatePercent: 100,
    activeDomainsCount: 0,
    averageSpeedMs: 180,
    remainingQuota: 10,
    monthlyQuota: 10,
    tier: 'free',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Fetch Current Logged-in User Profile
  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        fetchHistoryData();
      } else {
        setCurrentUser(null);
        setJobsHistory([]);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  // Fetch Isolated User Jobs & History
  const fetchHistoryData = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        setJobsHistory(data.jobs || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // SSE Telemetry Stream
    const eventSource = new EventSource('/api/index/stream');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'job_update' && payload.job) {
          const updatedJob: IndexingJob = payload.job;

          setActiveJob((prev) => {
            if (!prev || prev.id === updatedJob.id) {
              return updatedJob;
            }
            return prev;
          });

          fetchHistoryData();
          fetchUserProfile();
        }
      } catch {}
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setJobsHistory([]);
    setActiveJob(null);
  };

  const handleRequestUpgrade = async (tier: SubscriptionTier) => {
    const res = await fetch('/api/subscription/request-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetTier: tier }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to request upgrade');
    }

    await fetchUserProfile();
    setIsPricingModalOpen(false);
  };

  // Submit Handler with Quota Guard Catch
  const handleSubmission = async (data: {
    rawInput: string;
    engines: EngineType[];
    performPreflight: boolean;
  }) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

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
        if (res.status === 402 || result.upgradeRequired) {
          setIsPricingModalOpen(true);
        }
        throw new Error(result.error || 'Failed to submit URLs.');
      }

      if (result.job) {
        setActiveJob(result.job);
      }

      await fetchHistoryData();
      await fetchUserProfile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCredentials={() => setIsCredentialsModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        activeJobsCount={activeJob && activeJob.status === 'submitting' ? 1 : 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Hero Section */}
        <section className="relative text-center py-6 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 shadow-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Multi-Tenant Enterprise Indexing Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Instant Search Indexing for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Every Website & Domain
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Submit your URLs or sitemaps to trigger immediate crawling by Bing, Yandex, Google, Naver, and Seznam.
          </p>

          {!currentUser && (
            <div className="pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition"
              >
                ⚡ Get Started Free — 10 URLs / month included
              </button>
            </div>
          )}
        </section>

        {/* Submitter & Telemetry Console */}
        <section className="space-y-8">
          <UrlSubmitter
            onSubmit={handleSubmission}
            isSubmitting={isSubmitting}
            hasGoogleCreds={currentUser?.hasGoogleCreds || false}
            onOpenCredentials={() => setIsCredentialsModalOpen(true)}
          />

          <LiveMonitor job={activeJob} />
        </section>

        {/* History Dashboard */}
        {currentUser ? (
          <section className="pt-6">
            <HistoryDashboard stats={stats} jobs={jobsHistory} />
          </section>
        ) : (
          <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-3">
            <Lock className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Private User Workspace Panel</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Log in to view your private submission history, connect your own Google API key, and manage your monthly indexing quota.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
            >
              Sign In to Your Workspace
            </button>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} IndexPulse Enterprise. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>IndexNow Engine v2.0</span>
            <span>•</span>
            <span>AES-256 Encrypted</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          fetchHistoryData();
        }}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentTier={currentUser?.tier || 'free'}
        planStatus={currentUser?.planStatus}
        onRequestUpgrade={handleRequestUpgrade}
      />

      <CredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onSaved={fetchUserProfile}
        hasGoogleCreds={currentUser?.hasGoogleCreds || false}
        googleClientEmail={null}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
