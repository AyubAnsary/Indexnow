'use client';

import React, { useState } from 'react';
import { X, Check, Zap, Sparkles, Shield, ArrowRight, Clock } from 'lucide-react';
import { PLAN_TIERS, SubscriptionTier } from '@/lib/types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  planStatus?: string;
  onRequestUpgrade: (tier: SubscriptionTier) => Promise<void>;
}

export default function PricingModal({
  isOpen,
  onClose,
  currentTier,
  planStatus,
  onRequestUpgrade,
}: PricingModalProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setLoadingTier(tier);
    try {
      await onRequestUpgrade(tier);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-10 shadow-2xl shadow-slate-950 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-white">Select Your Indexing Plan</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                FLEXIBLE BILLING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Scale your search indexation quotas instantly. Admin approves upgrades manually.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(PLAN_TIERS).map((plan) => {
            const isCurrent = currentTier === plan.id;
            const isPending = planStatus === 'approval_pending' && currentTier !== plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                  plan.id === 'pro'
                    ? 'bg-slate-900 border-indigo-500/60 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : isCurrent
                    ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.id === 'pro' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-[10px] tracking-wider uppercase shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                  <div className="my-5">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      {plan.id === 'custom' ? 'Custom' : `$${plan.priceMonthly}`}
                    </span>
                    {plan.id !== 'custom' && <span className="text-xs text-slate-400"> / month</span>}
                  </div>

                  {/* Quota Badge */}
                  <div className="mb-6 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {plan.monthlyQuota.toLocaleString()} URLs / month
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  disabled={isCurrent || loadingTier === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 ${
                    isCurrent
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : plan.id === 'pro'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isCurrent ? (
                    <span>Current Active Plan</span>
                  ) : loadingTier === plan.id ? (
                    <span>Submitting Request...</span>
                  ) : isPending ? (
                    <span className="flex items-center space-x-1 text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Approval Pending</span>
                    </span>
                  ) : (
                    <>
                      <span>{plan.id === 'custom' ? 'Request Quote' : 'Upgrade Plan'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
