'use client';

import React, { useState } from 'react';
import { X, Key, Upload, CheckCircle2, AlertCircle, Shield, Info } from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  hasGoogleCreds: boolean;
  googleClientEmail?: string | null;
}

export default function CredentialsModal({
  isOpen,
  onClose,
  onSaved,
  hasGoogleCreds,
  googleClientEmail,
}: CredentialsModalProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonInput(content);
        setStatusMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      setStatusMsg({ type: 'error', text: 'Please paste or upload a Google Service Account JSON file.' });
      return;
    }

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleServiceAccountJson: jsonInput }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save credentials.');
      }

      setStatusMsg({ type: 'success', text: 'Google Service Account credentials saved & verified successfully!' });
      onSaved();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON file';
      setStatusMsg({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl shadow-slate-950 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Indexing API Setup</h3>
              <p className="text-xs text-slate-400">Connect free Google Service Account JSON key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Status */}
        {hasGoogleCreds && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-200">Active Service Account Configured</p>
              <p className="font-mono text-emerald-400 mt-0.5">{googleClientEmail}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Service Account JSON Key File
              </label>
              <label className="cursor-pointer text-xs text-cyan-400 hover:underline flex items-center space-x-1">
                <Upload className="w-3 h-3" />
                <span>Upload JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`Paste the contents of your Google Service Account JSON file here...\n\nExample:\n{\n  "type": "service_account",\n  "project_id": "my-project",\n  "private_key": "-----BEGIN PRIVATE KEY-----\\n...",\n  "client_email": "indexer@my-project.iam.gserviceaccount.com"\n}`}
              rows={7}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 text-slate-200 placeholder-slate-600 p-4 font-mono text-xs leading-relaxed outline-none shadow-inner"
            ></textarea>
          </div>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Setup Guide Info */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-normal">
            <p className="font-semibold text-slate-300 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>How to get a free Google Service Account key:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Go to <strong>Google Cloud Console</strong> & enable <em>Indexing API</em>.</li>
              <li>Create a <strong>Service Account</strong> and download the <code>.json</code> key file.</li>
              <li>Add the service account email as an Owner in your <strong>Google Search Console</strong> property.</li>
            </ol>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              {isSaving ? 'Saving...' : 'Save & Verify Key'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
