'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = tab === 'login' ? { email, password } : { email, name, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      onSuccess(data.user);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication error';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl shadow-slate-950 space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className={`text-base font-bold transition ${
                tab === 'login' ? 'text-white border-b-2 border-cyan-400 pb-1' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('register');
                setErrorMsg(null);
              }}
              className={`text-base font-bold transition ${
                tab === 'register' ? 'text-white border-b-2 border-cyan-400 pb-1' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {tab === 'register' && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>New accounts automatically receive <strong>10 URLs / month Free</strong>!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-emerald-400 transition"
          >
            {isLoading ? 'Processing...' : tab === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          <span>Demo Admin Account: </span>
          <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            admin@indexpulse.com / admin123
          </code>
        </div>

      </div>
    </div>
  );
}
