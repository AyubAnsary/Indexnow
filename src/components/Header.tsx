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
  GitBranch,
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        
        {/* Brand Logo - Zapier Style */}
        <div className="flex items-center space-x-8">
          <a href="/" className="flex items-center space-x-1 font-black text-2xl tracking-tight text-slate-900">
            <span className="text-[#FF4F00] text-3xl leading-none font-sans">_</span>
            <span className="font-extrabold tracking-tight text-slate-900">silverstone</span>
          </a>

          {/* Desktop Navigation Links */}
          {!currentUser && (
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-700">
              <div className="relative group cursor-pointer flex items-center space-x-1 hover:text-[#FF4F00] transition">
                <span>Products</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              <div className="relative group cursor-pointer flex items-center space-x-1 hover:text-[#FF4F00] transition">
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              <div className="relative group cursor-pointer flex items-center space-x-1 hover:text-[#FF4F00] transition">
                <span>Resources</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
              <a href="#enterprise" className="hover:text-[#FF4F00] transition">Enterprise</a>
              <button onClick={onOpenPricing} className="hover:text-[#FF4F00] transition">Pricing</button>
            </nav>
          )}
        </div>

        {/* Right Header Navigation & CTAs */}
        <div className="flex items-center space-x-4 text-sm font-semibold text-slate-700">
          
          <a
            href="https://github.com/AyubAnsary/Indexnow"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 hover:text-[#FF4F00] transition"
          >
            <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </a>

          <a href="#apps" className="hidden md:inline-block hover:text-[#FF4F00] transition">
            Explore apps
          </a>

          <a href="https://ayubansary.com" target="_blank" rel="noopener noreferrer" className="hidden md:inline-block hover:text-[#FF4F00] transition">
            Contact sales
          </a>

          {currentUser ? (
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {currentUser.name} ({currentUser.tier.toUpperCase()})
              </span>
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-slate-800 font-bold hover:text-[#FF4F00] transition"
              >
                Log in
              </button>

              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-full bg-[#FF4F00] hover:bg-[#e04500] text-white font-extrabold text-xs shadow-md shadow-[#FF4F00]/25 transition-transform hover:scale-[1.02]"
              >
                Sign up
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 font-semibold text-sm text-slate-800">
          <button onClick={onOpenPricing} className="block w-full text-left py-2 hover:text-[#FF4F00]">Pricing</button>
          <a href="https://ayubansary.com" target="_blank" rel="noopener noreferrer" className="block w-full text-left py-2 hover:text-[#FF4F00]">Contact Sales</a>
          <button onClick={onOpenAuth} className="w-full py-3 rounded-full bg-[#FF4F00] text-white font-extrabold text-xs">Sign up</button>
        </div>
      )}
    </header>
  );
}
