import { IntelTable } from "@/components/dashboard/IntelTable";
import { createClient } from "@/lib/supabase/server";
import { Globe, ShieldAlert, Database, Zap } from 'lucide-react';

export default async function IntelPage() {
  const supabase = await createClient();
  
  const { data: intel } = await supabase
    .from('global_blocklist')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="animate-fade-in-up">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="status-badge bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-[10px]">
            <Globe className="w-3 h-3" />
            Global Network
          </div>
          <div className="status-badge bg-red-500/10 text-red-500 border border-red-500/20 text-[10px]">
            <ShieldAlert className="w-3 h-3" />
            High Risk Active
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl heading-accent uppercase tracking-tight">Threat Intelligence</h1>
        <p className="mt-3 text-sm text-zinc-500 max-w-xl font-medium leading-relaxed">
          Aggregated real-time feed of malicious infrastructure identified by global security partners. 
          This high-confidence data powers the primary defense layer for all active sessions.
        </p>
      </header>

      <div className="rounded-2xl border border-white/6 bg-zinc-900/10 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_50px_-12px_rgba(0,210,255,0.05)]">
        {intel && intel.length > 0 ? (
          <IntelTable entries={intel} />
        ) : (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-neon-blue/20 rounded-full blur-xl animate-pulse" />
              <div className="relative h-20 w-20 flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 shadow-2xl">
                <Database className="w-10 h-10 text-zinc-700" />
              </div>
            </div>
            <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Synchronizing Global Feeds</p>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto">The intelligence engine is currently aggregating data from CISA, Firehol, and URLhaus. System availability is unaffected.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-white/3 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {intel?.length || 0} Critical Vectors Identified
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-red-500/70">Critical Severity</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/70">Medium Alert</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-blue/5 border border-neon-blue/10">
            <div className="h-1.5 w-1.5 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(0,210,255,0.5)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-neon-blue/70">Engine Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
