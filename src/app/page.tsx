'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import UserPanel from '@/components/UserPanel';
import UrlSubmitter from '@/components/UrlSubmitter';
import LiveMonitor from '@/components/LiveMonitor';
import HistoryDashboard from '@/components/HistoryDashboard';
import CredentialsModal from '@/components/CredentialsModal';
import AuthModal from '@/components/AuthModal';
import PricingModal from '@/components/PricingModal';
import AdminPanelModal from '@/components/AdminPanelModal';
import { EngineType, IndexingJob, IndexingStats, SubscriptionTier } from '@/lib/types';
import { Sparkles, ShieldAlert, Zap, Layers, Lock, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

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
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCredentials={() => setIsCredentialsModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        activeJobsCount={activeJob && activeJob.status === 'submitting' ? 1 : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {currentUser ? (
          /* Logged-In Modern User Panel */
          <UserPanel
            user={currentUser}
            activeJob={activeJob}
            stats={stats}
            jobsHistory={jobsHistory}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmission}
            onRefreshData={fetchUserProfile}
            onRequestUpgrade={handleRequestUpgrade}
          />
        ) : (
          /* Unauthenticated Landing / Hero Console */
          <div className="space-y-12">
            {/* Hero Banner */}
            <section className="relative text-center py-8 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 shadow-md">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Enterprise Multi-Engine Indexing Suite</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-tight">
                Get Your URLs Indexed across <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                  Google, Bing & Yandex
                </span>{' '}
                Instantly.
              </h1>

              <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                Paste any URL or XML sitemap link. Our engine automatically validates, generates verification keys, and broadcasts changes to search crawlers.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition transform hover:scale-[1.02] flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-cyan-200" />
                  <span>Start Indexing Free — 10 URLs/month</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPricingModalOpen(true)}
                  className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition"
                >
                  View Subscription Plans ($5/mo)
                </button>
              </div>
            </section>

            {/* Quick Demo Submitter Preview */}
            <section className="space-y-8">
              <UrlSubmitter
                onSubmit={handleSubmission}
                isSubmitting={isSubmitting}
                hasGoogleCreds={false}
                onOpenCredentials={() => setIsAuthModalOpen(true)}
              />

              <LiveMonitor job={activeJob} />
            </section>
          </div>
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

      {/* Global Modals */}
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
