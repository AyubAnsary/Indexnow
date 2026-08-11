'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Shield,
  CheckCircle,
  XCircle,
  Users,
  Search,
  Zap,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { SubscriptionTier } from '@/lib/types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [customQuotaInput, setCustomQuotaInput] = useState('2500');
  const [customPriceInput, setCustomPriceInput] = useState('35');
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApproveReject = async (targetUserId: string, action: 'approve' | 'reject') => {
    setActionMsg(null);
    try {
      const res = await fetch('/api/admin/approve-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, action }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Action failed');

      setActionMsg({ type: 'success', text: data.message });
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      setActionMsg({ type: 'error', text: msg });
    }
  };

  const handleGrantCustomQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setActionMsg(null);
    try {
      const res = await fetch('/api/admin/grant-quota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          customQuota: customQuotaInput,
          customPrice: customPriceInput,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Grant failed');

      setActionMsg({ type: 'success', text: data.message });
      setSelectedUser(null);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Grant failed';
      setActionMsg({ type: 'error', text: msg });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl shadow-slate-950 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">Executive Admin Control Panel</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  SYSTEM ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage user quotas, approve plan upgrades, and grant custom pricing.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {actionMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
              actionMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {actionMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Custom Quota Grant Form Modal */}
        {selectedUser && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center space-x-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Grant Custom URL Quota & Pricing for: {selectedUser.email}</span>
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleGrantCustomQuota} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Monthly URL Quota</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={customQuotaInput}
                  onChange={(e) => setCustomQuotaInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/80"
                  placeholder="e.g. 2500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Price ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={customPriceInput}
                  onChange={(e) => setCustomPriceInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-cyan-500/80"
                  placeholder="e.g. 35"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  Grant Quota & Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar & Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Total Users: {users.length}
          </span>
        </div>

        {/* User Accounts Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User Account</th>
                <th className="py-3 px-4">Active Plan</th>
                <th className="py-3 px-4">Monthly Usage</th>
                <th className="py-3 px-4">Plan Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    Loading user directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    {/* User */}
                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>

                    {/* Active Plan */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                        {u.tier}
                      </span>
                    </td>

                    {/* Monthly Usage */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-400 font-bold">
                          {u.urlsUsedThisMonth} / {u.monthlyQuota.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500">URLs</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {u.planStatus === 'approval_pending' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-semibold animate-pulse">
                          Pending Request ({u.requestedTier?.toUpperCase()})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {u.planStatus === 'approval_pending' && (
                        <>
                          <button
                            onClick={() => handleApproveReject(u.id, 'approve')}
                            className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveReject(u.id, 'reject')}
                            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setCustomQuotaInput(u.monthlyQuota.toString());
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition"
                      >
                        Grant Quota
                      </button>
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
