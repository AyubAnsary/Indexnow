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
  ChevronDown,
  Globe,
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
    <header className="sticky top-3 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Floating Glassmorphic Menubar Pill */}
      <div className="relative backdrop-blur-2xl bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl shadow-slate-950/80 px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between transition-all">
        
        {/* Brand Logo & Status */}
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

        {/* Desktop Quick Nav Links */}
        {!currentUser && (
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#indexer" className="hover:text-white transition flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              <span>Indexer</span>
            </a>
            <a href="#matrix" className="hover:text-white transition flex items-center space-x-1">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Speed Matrix</span>
            </a>
            <button onClick={onOpenPricing} className="hover:text-white transition flex items-center space-x-1 cursor-pointer">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Pricing</span>
            </button>
            <a href="#faq" className="hover:text-white transition flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>FAQ</span>
            </a>
            <a href="https://ayubansary.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>AyubAnsary.com</span>
            </a>
          </nav>
        )}

        {/* Header Right Action Buttons */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                {currentUser.name} ({currentUser.tier.toUpperCase()})
              </span>
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                Sign In
              </button>

              <button
                onClick={onOpenAuth}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-slate-400/20 hover:from-white hover:to-slate-300 transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Get Started Free</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-semibold text-xs text-slate-300">
          <button onClick={onOpenPricing} className="block w-full text-left py-2 hover:text-white">Pricing</button>
          <a href="https://ayubansary.com" target="_blank" rel="noopener noreferrer" className="block w-full text-left py-2 hover:text-white">AyubAnsary.com</a>
          <button onClick={onOpenAuth} className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-zinc-400 text-slate-950 font-extrabold text-xs">Get Started Free</button>
        </div>
      )}
    </header>
  );
}
