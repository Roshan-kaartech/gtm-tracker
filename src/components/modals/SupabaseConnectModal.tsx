import React, { useState, useEffect } from 'react';
import { useGTM } from '../../context/GTMContext';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Radio, 
  UploadCloud, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { 
  getActiveSupabaseConfig, 
  setCustomSupabaseCredentials, 
  clearCustomSupabaseCredentials,
  testSupabaseConnection,
  seedCloudDeliverables
} from '../../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCHEMA_TEXT = `-- 1. Create Deliverables Table
CREATE TABLE IF NOT EXISTS public.gtm_deliverables (
    id TEXT PRIMARY KEY,
    stream TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL DEFAULT '20-Aug',
    end_date TEXT NOT NULL DEFAULT '30-Sep',
    milestone1 JSONB NOT NULL DEFAULT '{}'::jsonb,
    milestone2 JSONB NOT NULL DEFAULT '{}'::jsonb,
    milestone3 JSONB NOT NULL DEFAULT '{}'::jsonb,
    owner TEXT NOT NULL DEFAULT 'Sai',
    priority TEXT NOT NULL DEFAULT 'medium',
    progress INTEGER NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Settings Table
CREATE TABLE IF NOT EXISTS public.gtm_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security & Real-Time Setup
ALTER TABLE public.gtm_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gtm_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all on deliverables" ON public.gtm_deliverables FOR ALL USING (true);
CREATE POLICY "Allow public all on settings" ON public.gtm_settings FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.gtm_deliverables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gtm_settings;`;

export const SupabaseConnectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { items, isCloudConnected, reconnectCloud, showToast } = useGTM();

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const active = getActiveSupabaseConfig();
      setUrl(active.url);
      setAnonKey(active.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      showToast('Please enter both Supabase URL and Anon Key', 'error');
      return;
    }

    setCustomSupabaseCredentials(url.trim(), anonKey.trim());
    setIsTesting(true);
    setTestResult(null);

    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      showToast('Connected to Supabase with real-time sync! 🚀', 'success');
      await reconnectCloud();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect Supabase and revert to local storage?')) {
      clearCustomSupabaseCredentials();
      setUrl('');
      setAnonKey('');
      setTestResult(null);
      reconnectCloud();
      showToast('Switched back to local storage', 'info');
      onClose();
    }
  };

  const handlePushLocalData = async () => {
    setIsMigrating(true);
    const success = await seedCloudDeliverables(items);
    setIsMigrating(false);
    if (success) {
      showToast(`Pushed ${items.length} initiatives to Supabase cloud database! 🎉`, 'success');
      await reconnectCloud();
    } else {
      showToast('Failed to push data. Check connection and SQL schema.', 'error');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_TEXT);
    setCopiedSql(true);
    showToast('SQL Schema copied to clipboard!', 'info');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg glass-modal rounded-2xl sm:rounded-3xl overflow-hidden my-auto animate-slide-up max-h-[92vh] flex flex-col border border-kaar-deepRed/20 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-white/70 shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="min-w-0 truncate">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                Supabase Real-Time Cloud Sync
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">
                Multi-user live synchronization across team devices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-kaar-deepRed hover:bg-kaar-deepRed/5 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-white/40 text-xs">
          
          {/* Status Capsule */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
            isCloudConnected 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50/80 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center space-x-2.5">
              {isCloudConnected ? (
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
              ) : (
                <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
              )}
              <div>
                <div className="font-bold">
                  {isCloudConnected ? '🟢 Live Cloud Real-Time Active' : '🟡 Local Storage Mode'}
                </div>
                <div className="text-[10px] opacity-80">
                  {isCloudConnected 
                    ? 'All teammates see changes instantly without refreshing.' 
                    : 'Changes are currently saved only to your local browser.'}
                </div>
              </div>
            </div>

            {isCloudConnected && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-2.5 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-100/50 border border-rose-200 rounded-lg flex items-center gap-1 transition-colors"
                title="Disconnect cloud sync"
              >
                <Trash2 className="w-3 h-3" />
                Disconnect
              </button>
            )}
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleSaveAndConnect} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>Supabase Project URL</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-kaar-deepRed hover:underline flex items-center gap-0.5 text-[10px] font-normal"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </label>
              <input
                type="url"
                required
                placeholder="https://your-project-id.supabase.co"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-gray-900 font-mono placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-gray-900 font-mono placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Test result alert */}
            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:text-kaar-deepRed glass-btn rounded-xl transition-all"
              >
                <Copy className="w-3.5 h-3.5 text-kaar-deepRed" />
                <span>{copiedSql ? '✓ Copied SQL Schema' : 'Copy SQL Schema'}</span>
              </button>

              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-1.5 text-xs font-semibold rounded-full glass-btn-primary flex items-center gap-1.5 disabled:opacity-50 shadow-md"
              >
                {isTesting ? (
                  <span>Testing Connection...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save & Connect Cloud</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Migration Tool */}
          {isCloudConnected && (
            <div className="pt-3 border-t border-gray-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Cloud Dataset Migration
              </span>
              <div className="p-3 rounded-2xl bg-white border border-kaar-deepRed/15 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">Push Current 17 Initiatives to Supabase</div>
                  <div className="text-[10px] text-gray-500">
                    Syncs all deliverable names, milestones, and dates to the remote database
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePushLocalData}
                  disabled={isMigrating}
                  className="px-3 py-1.5 text-xs font-bold bg-kaar-deepRed text-white hover:bg-kaar-deepRed/90 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isMigrating ? 'Pushing...' : 'Push to Cloud'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Steps Guide */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-[11px] text-gray-600">
            <span className="font-bold text-gray-800 block">Quick 2-Minute Supabase Setup:</span>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Create a free project at <strong className="text-gray-900">supabase.com</strong>.</li>
              <li>Go to <strong className="text-gray-900">SQL Editor</strong>, paste the copied SQL schema, and click <strong className="text-gray-900">Run</strong>.</li>
              <li>Copy your <strong className="text-gray-900">Project URL</strong> and <strong className="text-gray-900">anon key</strong> from Settings &gt; API into this modal.</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-white/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 glass-btn rounded-full transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
