'use client';

import React, { useState, useEffect } from 'react';
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
  Terminal,
  Copy,
  Check,
  Plus,
  Trash2,
  Play,
  Cpu,
} from 'lucide-react';
import UrlSubmitter from './UrlSubmitter';
import LiveMonitor from './LiveMonitor';
import HistoryDashboard from './HistoryDashboard';
import CredentialsModal from './CredentialsModal';
import AdminPanelModal from './AdminPanelModal';
import PricingModal from './PricingModal';
import { IndexingJob, IndexingStats, SubscriptionTier, UserRole, SitemapMonitor, ApiKey } from '@/lib/types';

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
  const [activeTab, setActiveTab] = useState<'submitter' | 'monitors' | 'apikeys' | 'analytics' | 'credentials' | 'billing'>('submitter');
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sitemap Monitor State
  const [monitors, setMonitors] = useState<SitemapMonitor[]>([]);
  const [newSitemapUrl, setNewSitemapUrl] = useState('');
  const [checkInterval, setCheckInterval] = useState(360);
  const [isAddingMonitor, setIsAddingMonitor] = useState(false);
  const [monitorMsg, setMonitorMsg] = useState<string | null>(null);
  const [syncingMonitorId, setSyncingMonitorId] = useState<string | null>(null);

  // API Key State
  const [apiKeys, setApiKeys] = useState<Omit<ApiKey, 'hashedKey'>[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdSecretKey, setCreatedSecretKey] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  const quotaPercent = user.monthlyQuota > 0
    ? Math.min(100, Math.round((user.urlsUsedThisMonth / user.monthlyQuota) * 100))
    : 0;

  // Fetch Monitors
  const fetchMonitors = async () => {
    try {
      const res = await fetch('/api/monitors');
      const data = await res.json();
      if (data.success) setMonitors(data.monitors || []);
    } catch {}
  };

  // Fetch API Keys
  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/developer/keys');
      const data = await res.json();
      if (data.success) setApiKeys(data.keys || []);
    } catch {}
  };

  useEffect(() => {
    fetchMonitors();
    fetchApiKeys();
  }, []);

  // Add Monitor Handler
  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSitemapUrl.trim()) return;

    setIsAddingMonitor(true);
    setMonitorMsg(null);
    try {
      const res = await fetch('/api/monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sitemapUrl: newSitemapUrl.trim(), checkIntervalMinutes: checkInterval }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to add monitor');

      setNewSitemapUrl('');
      setMonitorMsg('Sitemap Auto-Monitor registered successfully!');
      fetchMonitors();
    } catch (err: any) {
      setMonitorMsg(`Error: ${err.message}`);
    } finally {
      setIsAddingMonitor(false);
    }
  };

  // Delete Monitor Handler
  const handleDeleteMonitor = async (monitorId: string) => {
    try {
      const res = await fetch('/api/monitors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monitorId }),
      });
      const data = await res.json();
      if (data.success) fetchMonitors();
    } catch {}
  };

  // Trigger Sync Handler
  const handleSyncMonitor = async (monitorId: string) => {
    setSyncingMonitorId(monitorId);
    try {
      const res = await fetch('/api/monitors/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monitorId }),
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        fetchMonitors();
      } else if (data.upgradeRequired) {
        setIsPricingOpen(true);
      }
    } finally {
      setSyncingMonitorId(null);
    }
  };

  // Create API Key Handler
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingKey(true);
    try {
      const res = await fetch('/api/developer/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || 'Developer Key' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create key');

      setCreatedSecretKey(data.rawSecretKey);
      setNewKeyName('');
      fetchApiKeys();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreatingKey(false);
    }
  };

  // Revoke API Key Handler
  const handleRevokeApiKey = async (keyId: string) => {
    try {
      const res = await fetch('/api/developer/keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId }),
      });
      const data = await res.json();
      if (data.success) fetchApiKeys();
    } catch {}
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Executive User Workspace Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl shadow-slate-950/40">
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-slate-400/15 via-zinc-400/10 to-slate-200/0 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* User Profile Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-400 via-slate-100 to-zinc-500 p-[2px] shadow-lg shadow-slate-400/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-slate-200">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-200 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
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
                <span className="text-slate-300 font-semibold">Workspace Active</span>
              </p>
            </div>
          </div>

          {/* Quota Progress Gauge Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-inner">
            <div className="space-y-1 min-w-[180px]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Monthly Quota</span>
                <span className="text-slate-200 font-bold">{quotaPercent}% Used</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    quotaPercent > 90
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-slate-300 via-slate-100 to-zinc-400'
                  }`}
                  style={{ width: `${Math.max(quotaPercent, 4)}%` }}
                ></div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Used: {user.urlsUsedThisMonth}</span>
                <span className="text-slate-200 font-bold">Remaining: {user.remainingQuota}</span>
              </div>
            </div>

            <button
              onClick={() => setIsPricingOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 hover:from-white hover:to-slate-300 text-slate-950 font-extrabold text-xs shadow-md shadow-slate-400/20 transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
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
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Zap className="w-4 h-4 text-slate-300" />
            <span>Instant Submitter</span>
          </button>

          <button
            onClick={() => setActiveTab('monitors')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'monitors'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-slate-300" />
            <span>Auto-Sitemap Monitor</span>
            {monitors.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-700 text-slate-200">
                {monitors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('apikeys')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'apikeys'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4 text-slate-300" />
            <span>Developer REST API Keys</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-300" />
            <span>Analytics & Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'credentials'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Key className="w-4 h-4 text-slate-300" />
            <span>Google API Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition duration-200 ${
              activeTab === 'billing'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4 text-slate-300" />
            <span>Billing</span>
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition shadow-md ml-auto"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Panel</span>
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

        {/* 🔄 Auto-Sitemap Monitor Tab */}
        {activeTab === 'monitors' && (
          <motion.div
            key="monitors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-slate-300" />
                  <span>Automated XML Sitemap Auto-Monitor (Zero-Touch)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Register your site sitemap XML link. SilverStone background engine automatically detects new URLs and broadcasts them for indexing!
                </p>
              </div>
            </div>

            {/* Register New Monitor Form */}
            <form onSubmit={handleAddMonitor} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Register New Sitemap Monitor</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <input
                    type="url"
                    value={newSitemapUrl}
                    onChange={(e) => setNewSitemapUrl(e.target.value)}
                    placeholder="https://yourdomain.com/sitemap.xml"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-slate-500"
                  />
                </div>
                <div>
                  <select
                    value={checkInterval}
                    onChange={(e) => setCheckInterval(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono outline-none focus:border-slate-500"
                  >
                    <option value={60}>Check Every 1 Hour</option>
                    <option value={360}>Check Every 6 Hours</option>
                    <option value={1440}>Check Every 24 Hours</option>
                  </select>
                </div>
              </div>

              {monitorMsg && (
                <p className="text-xs font-mono text-slate-300">{monitorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isAddingMonitor}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>{isAddingMonitor ? 'Registering...' : 'Add Sitemap Monitor'}</span>
              </button>
            </form>

            {/* Active Monitors Grid */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Active Sitemap Monitors ({monitors.length})</h4>

              {monitors.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                  No sitemap monitors registered yet. Add your sitemap XML link above to start zero-touch indexing!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monitors.map((m) => (
                    <div key={m.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-white block font-mono truncate max-w-[240px]">
                            {m.sitemapUrl}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                            Domain: {m.domain} • Check interval: {m.checkIntervalMinutes} mins
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteMonitor(m.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                        <div>
                          <span className="text-slate-600 block text-[9px]">LAST CHECKED</span>
                          <span className="text-slate-300 font-bold">{m.lastCheckedAt ? new Date(m.lastCheckedAt).toLocaleTimeString() : 'Pending'}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 block text-[9px]">AUTO INDEXED</span>
                          <span className="text-slate-200 font-bold">{m.discoveredUrlsCount} URLs</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSyncMonitor(m.id)}
                        disabled={syncingMonitorId === m.id}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition flex items-center justify-center space-x-1.5"
                      >
                        <Play className="w-3.5 h-3.5 text-slate-300" />
                        <span>{syncingMonitorId === m.id ? 'Syncing Sitemap...' : 'Run Sync & Index Now'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 🔌 Developer REST API Keys Tab */}
        {activeTab === 'apikeys' && (
          <motion.div
            key="apikeys"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-slate-300" />
                  <span>Developer REST API & Secret Key Vault</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Generate secret API keys (<code className="text-slate-200">sk_silverstone_...</code>) to automate URL indexing via cURL, Python, WordPress, or Zapier!
                </p>
              </div>
            </div>

            {/* Secret Key Created Display Alert */}
            {createdSecretKey && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-700 space-y-3 animate-fade-in">
                <div className="flex items-center space-x-2 text-slate-200 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  <span>API Key Generated! Copy your secret key now (it will not be shown again):</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={createdSecretKey}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdSecretKey);
                      setCopiedSecret(true);
                      setTimeout(() => setCopiedSecret(false), 2000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center space-x-1"
                  >
                    {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSecret ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Create API Key Form */}
            <form onSubmit={handleCreateApiKey} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Generate New API Key</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key label (e.g. Production WordPress Plugin, Zapier Webhook)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-slate-500"
                />
                <button
                  type="submit"
                  disabled={isCreatingKey}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md hover:from-white hover:to-slate-300 transition flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>{isCreatingKey ? 'Generating...' : 'Generate API Key'}</span>
                </button>
              </div>
            </form>

            {/* Public REST API Usage Example Snippet */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>cURL Integration Code Snippet</span>
              </h4>
              <pre className="p-4 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
{`curl -X POST http://localhost:3000/api/v1/index \\
  -H "Authorization: Bearer sk_silverstone_YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": ["https://yourdomain.com/new-post", "https://yourdomain.com/product-123"],
    "engines": ["indexnow", "ping"]
  }'`}
              </pre>
            </div>

            {/* Active API Keys List */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Active API Keys ({apiKeys.length})</h4>

              {apiKeys.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                  No API keys generated yet. Generate a secret key above to automate URL submissions.
                </div>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-sm font-bold text-white block">{k.name}</span>
                        <span className="text-slate-400 text-[11px]">{k.keyPrefix}...</span>
                        <span className="text-slate-600 text-[10px] block mt-0.5">
                          Created: {new Date(k.createdAt).toLocaleDateString()} • Last used: {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleTimeString() : 'Never'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRevokeApiKey(k.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition"
                      >
                        Revoke Key
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  <Key className="w-5 h-5 text-slate-300" />
                  <span>Google Cloud Service Account Vault</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your private Google Service Account key. Credentials are encrypted at rest with AES-256-GCM.
                </p>
              </div>

              <button
                onClick={() => setIsCredentialsOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 hover:from-white hover:to-slate-300 text-slate-950 font-extrabold text-xs shadow-lg transition"
              >
                {user.hasGoogleCreds ? 'Update Key' : 'Connect Google JSON Key'}
              </button>
            </div>

            {user.hasGoogleCreds ? (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-slate-200 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-slate-300" />
                  <span>Google Indexing API Key Verified & Encrypted</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
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
                  <CreditCard className="w-5 h-5 text-slate-300" />
                  <span>Subscription Plan & Quotas</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Manage your active tier, quota allowances, and upgrade requests.</p>
              </div>

              <button
                onClick={() => setIsPricingOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 hover:from-white hover:to-slate-300 text-slate-950 font-extrabold text-xs shadow-lg transition"
              >
                Change Subscription Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">Current Plan</span>
                <h4 className="text-2xl font-extrabold text-white uppercase">{user.tier} Plan</h4>
                <p className="text-xs text-slate-300 font-mono font-semibold">
                  Status: {user.planStatus === 'approval_pending' ? 'Pending Approval' : 'Active'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">Monthly Quota</span>
                <h4 className="text-2xl font-extrabold text-slate-200 font-mono">
                  {user.monthlyQuota.toLocaleString()} URLs
                </h4>
                <p className="text-xs text-slate-400">Resets automatically every 30 days</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">URLs Used This Cycle</span>
                <h4 className="text-2xl font-extrabold text-slate-200 font-mono">
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
