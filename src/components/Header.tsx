'use client';

import React from 'react';
import { Shield, Key, User, LogOut, Sparkles, Layers, ArrowUpRight, Cpu } from 'lucide-react';
import { SubscriptionTier, UserRole } from '@/lib/types';

interface HeaderProps {
  currentUser: {
    name: string;
    email: string;
    role: UserRole;
    tier: SubscriptionTier;
    remainingQuota: number;
    monthlyQuota: number;
    hasGoogleCreds: boolean;
  } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCredentials: () => void;
  onOpenPricing: () => void;
  onOpenAdmin: () => void;
  activeJobsCount: number;
}

export default function Header({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCredentials,
  onOpenPricing,
  onOpenAdmin,
  activeJobsCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800 shadow-xl shadow-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Metallic SilverStone Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-400 via-slate-100 to-zinc-500 p-[1px] shadow-lg shadow-slate-400/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-slate-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SilverStone
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                METALLIC ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
              <span>Universal Search Indexer</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium">IndexNow Active</span>
            </p>
          </div>
        </div>

        {/* User Workspace & Controls */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              {/* Admin Panel Trigger (If Admin) */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition shadow-md"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              {/* Monthly Quota Indicator Pill */}
              <button
                onClick={onOpenPricing}
                className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition"
              >
                <span className="text-slate-400">Quota:</span>
                <span className="font-mono text-slate-200 font-bold">
                  {currentUser.remainingQuota} / {currentUser.monthlyQuota.toLocaleString()}
                </span>
                <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {currentUser.tier}
                </span>
              </button>

              {/* Connect Google API Key */}
              <button
                onClick={onOpenCredentials}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                  currentUser.hasGoogleCreds
                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">
                  {currentUser.hasGoogleCreds ? 'Google Key OK' : 'Connect Google API'}
                </span>
              </button>

              {/* Upgrade Plan Button */}
              <button
                onClick={onOpenPricing}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md shadow-slate-400/20 hover:from-white hover:to-slate-300 transition"
              >
                <span>Plans</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
              </button>

              {/* User Profile Avatar & Logout */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 uppercase shadow-inner">
                  {currentUser.name.substring(0, 2)}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 hover:from-white hover:to-slate-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-slate-400/20 transition"
            >
              <User className="w-4 h-4 text-slate-950" />
              <span>Sign In / Register</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
