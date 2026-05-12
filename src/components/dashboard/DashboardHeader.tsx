'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Download, RefreshCw, Plus } from 'lucide-react';
import { syncFeedsManually } from '@/lib/actions/intel';
import { APP_CONFIG } from '@/lib/constants';

export function DashboardHeader() {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSyncFeeds = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    const loadingToast = toast.loading('Synchronizing threat intelligence feeds...');

    try {
      await syncFeedsManually();
      toast.success('Feeds synchronized successfully', { id: loadingToast });
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to sync feeds', { id: loadingToast });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-up">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="status-badge bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
            Real-time Monitoring
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight heading-accent">Security Overview</h1>
        <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">{APP_CONFIG.tagline} across all endpoints</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSyncFeeds}
          disabled={isSyncing}
          className={`flex items-center gap-2 rounded-xl border border-white/6 bg-white/2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all duration-300 hover:border-white/15 hover:bg-white/5 hover:text-white ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-white' : ''}`} />
          {isSyncing ? 'Syncing' : 'Sync Feeds'}
        </button>
        <button
          onClick={() => router.push('/dashboard/rules')}
          className="flex items-center gap-2 rounded-xl border border-neon-blue/20 bg-neon-blue/10 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Rule
        </button>
      </div>
    </header>
  );
}
