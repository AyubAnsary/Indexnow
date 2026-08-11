'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  BarChart3,
  Key,
  CreditCard,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Globe,
  Upload,
  Lock,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import UrlSubmitter from './UrlSubmitter';
import LiveMonitor from './LiveMonitor';
import HistoryDashboard from './HistoryDashboard';
import CredentialsModal from './CredentialsModal';
import AdminPanelModal from './AdminPanelModal';
import PricingModal from './PricingModal';
import { IndexingJob, IndexingStats, SubscriptionTier, UserRole } from '@/lib/types';

interface UserPanelProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tier: SubscriptionTier;
    planStatus: string;
    requestedTier?: string;
    remainingQuota: number;
    monthlyQuota: number;
    urlsUsedThisMonth: number;
    hasGoogleCreds: boolean;
  };
  activeJob: IndexingJob | null;
  stats: IndexingStats;
  jobsHistory: IndexingJob[];
  isSubmitting: boolean;
  onSubmit: (data: any) => Promise<void>;
  onRefreshData: () => void;
  onRequestUpgrade: (tier: SubscriptionTier) => Promise<void>;
}

export default function UserPanel({
  user,
  activeJob,
  stats,
  jobsHistory,
  isSubmitting,
  onSubmit,
  onRefreshData,
  onRequestUpgrade,
}: UserPanelProps) {
  const [activeTab, setActiveTab] = useState<'submitter' | 'analytics' | 'credentials' | 'billing' | 'admin'>('submitter');
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const quotaPercent = user.monthlyQuota > 0
    ? Math.min(100, Math.round((user.urlsUsedThisMonth / user.monthlyQuota) * 100))
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Executive User Workspace Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 p-6 md:p-8 shadow-2xl shadow-indigo-950/20">
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-emerald-500/0 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* User Profile Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-cyan-400">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30">
                  {user.tier} Plan
                </span>
                {user.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono flex items-center space-x-2">
                <span>{user.email}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">Workspace Active</span>
              </p>
            </div>
          </div>

          {/* Quota Progress Gauge Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 shadow-inner">
            <div className="space-y-1 min-w-[180px]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Monthly Quota</span>
                <span className="text-emerald-400 font-bold">{quotaPercent}% Used</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    quotaPercent > 90
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.max(quotaPercent, 4)}%` }}
                ></div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Used: {user.urlsUsedThisMonth}</span>
                <span className="text-cyan-300 font-bold">Remaining: {user.remainingQuota}</span>
              </div>
            </div>

            <button
              onClick={() => setIsPricingOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade Quota</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center space-x-2 pt-6 mt-6 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('submitter')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'submitter'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Instant Submitter</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Analytics & Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'credentials'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>API Key Vault</span>
            {user.hasGoogleCreds && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'billing'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>Plans & Billing</span>
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition shadow-md ml-auto"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Control Panel</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Panels Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'submitter' && (
          <motion.div
            key="submitter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <UrlSubmitter
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              hasGoogleCreds={user.hasGoogleCreds}
              onOpenCredentials={() => setIsCredentialsOpen(true)}
            />

            <LiveMonitor job={activeJob} />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <HistoryDashboard stats={stats} jobs={jobsHistory} />
          </motion.div>
        )}

        {activeTab === 'credentials' && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Key className="w-5 h-5 text-emerald-400" />
                  <span>Google Cloud Service Account Vault</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your private Google Service Account key. Credentials are encrypted at rest with AES-256-GCM.
                </p>
              </div>

              <button
                onClick={() => setIsCredentialsOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg transition"
              >
                {user.hasGoogleCreds ? 'Update Key' : 'Connect Google JSON Key'}
              </button>
            </div>

            {user.hasGoogleCreds ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Google Indexing API Key Verified & Encrypted</span>
                </div>
                <p className="text-xs text-emerald-200/80 font-mono">
                  AES-256-GCM Vault Status: ACTIVE • Ready for instant Google Search Indexing pushes.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs space-y-2 text-center">
                <Lock className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300">No Google API Key Connected Yet</p>
                <p className="text-slate-500 max-w-md mx-auto">
                  IndexNow and Sitemap Pings work automatically out of the box. Connect your Google Cloud key for direct Google Search API pushes.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>Subscription Plan & Quotas</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Manage your active tier, quota allowances, and upgrade requests.</p>
              </div>

              <button
                onClick={() => setIsPricingOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition"
              >
                Change Subscription Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">Current Plan</span>
                <h4 className="text-2xl font-extrabold text-white uppercase">{user.tier} Plan</h4>
                <p className="text-xs text-emerald-400 font-mono font-semibold">
                  Status: {user.planStatus === 'approval_pending' ? 'Pending Approval' : 'Active'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">Monthly Quota</span>
                <h4 className="text-2xl font-extrabold text-cyan-400 font-mono">
                  {user.monthlyQuota.toLocaleString()} URLs
                </h4>
                <p className="text-xs text-slate-400">Resets automatically every 30 days</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">URLs Used This Cycle</span>
                <h4 className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {user.urlsUsedThisMonth} URLs
                </h4>
                <p className="text-xs text-slate-400">{user.remainingQuota} URLs remaining</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <CredentialsModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
        onSaved={onRefreshData}
        hasGoogleCreds={user.hasGoogleCreds}
        googleClientEmail={null}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentTier={user.tier}
        planStatus={user.planStatus}
        onRequestUpgrade={onRequestUpgrade}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
