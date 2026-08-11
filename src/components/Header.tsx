'use client';

import React, { useState } from 'react';
import {
  Shield,
  Key,
  User,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Cpu,
  Menu,
  X,
  Zap,
  BarChart3,
  HelpCircle,
  CreditCard,
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Floating Glassmorphic Menubar Pill */}
      <div className="relative backdrop-blur-2xl bg-slate-900/85 border border-slate-800/90 rounded-2xl shadow-2xl shadow-slate-950/60 px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between transition-all">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-400 via-slate-100 to-zinc-500 p-[1px] shadow-lg shadow-slate-400/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-slate-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SilverStone
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                PRO ENGINE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono">
              <span>Universal Indexer</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-semibold">IndexNow Active</span>
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Menu Items */}
        {!currentUser && (
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300 font-sans">
            <a href="#indexer" className="hover:text-white transition flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              <span>Indexer</span>
            </a>
            <a href="#matrix" className="hover:text-white transition flex items-center space-x-1">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Speed Matrix</span>
            </a>
            <a href="#pricing" onClick={onOpenPricing} className="hover:text-white transition flex items-center space-x-1 cursor-pointer">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Pricing</span>
            </a>
            <a href="#faq" className="hover:text-white transition flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>FAQ</span>
            </a>
          </nav>
        )}

        {/* Action Controls & User Status */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              {/* Admin Panel Button */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition shadow-md"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              {/* Quota Indicator */}
              <button
                onClick={onOpenPricing}
                className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs transition"
              >
                <span className="text-slate-400">Quota:</span>
                <span className="font-mono text-slate-200 font-bold">
                  {currentUser.remainingQuota} / {currentUser.monthlyQuota.toLocaleString()}
                </span>
              </button>

              {/* Connect Google API Key */}
              <button
                onClick={onOpenCredentials}
                className={`hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                  currentUser.hasGoogleCreds
                    ? 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-slate-300" />
                <span>{currentUser.hasGoogleCreds ? 'Google Key OK' : 'Connect Google Key'}</span>
              </button>

              {/* Upgrade Button */}
              <button
                onClick={onOpenPricing}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-md shadow-slate-400/20 hover:from-white hover:to-slate-300 transition"
              >
                <span>Plans</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
              </button>

              {/* Profile & Logout */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 uppercase shadow-inner">
                  {currentUser.name.substring(0, 2)}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 hover:from-white hover:to-slate-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-slate-400/20 transition"
            >
              <User className="w-4 h-4 text-slate-950" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-3 font-sans text-xs">
          <a
            href="#indexer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl bg-slate-800 text-white font-semibold flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 text-slate-300" />
            <span>Instant Indexer</span>
          </a>
          <a
            href="#matrix"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl bg-slate-800 text-white font-semibold flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4 text-slate-300" />
            <span>Speed Benchmark Matrix</span>
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPricing();
            }}
            className="w-full text-left px-3 py-2 rounded-xl bg-slate-800 text-white font-semibold flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4 text-slate-300" />
            <span>Pricing & Quota Plans</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold flex items-center space-x-2"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Control Panel</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
