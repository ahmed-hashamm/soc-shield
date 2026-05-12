import { IncidentTable } from "@/components/dashboard/IncidentTable";
import { getRecentIncidents } from "@/lib/supabase/dashboard";
import { ShieldAlert, History, Activity } from 'lucide-react';

export default async function IncidentsPage() {
  const incidents = await getRecentIncidents(50); // Fetch more for the full page

  return (
    <div className="animate-fade-in-up">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="status-badge bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-[10px]">
            <History className="w-3 h-3" />
            Live Audit Trail
          </div>
          <div className="status-badge bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px]">
            <Activity className="w-3 h-3" />
            Engine Active
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl heading-accent uppercase tracking-tight">Incident History</h1>
        <p className="mt-3 text-sm text-zinc-500 max-w-xl font-medium leading-relaxed">
          Comprehensive real-time log of security events across your network. 
          Review engine decisions, threat classifications, and infrastructure impact.
        </p>
      </header>

      <div className="rounded-2xl border border-white/6 bg-zinc-900/10 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_50px_-12px_rgba(0,210,255,0.05)]">
        {incidents.length > 0 ? (
          <IncidentTable incidents={incidents} />
        ) : (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-neon-blue/20 rounded-full blur-xl animate-pulse" />
              <div className="relative h-20 w-20 flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 text-4xl shadow-2xl">
                <ShieldAlert className="w-10 h-10 text-zinc-700" />
              </div>
            </div>
            <p className="text-sm font-black text-white uppercase tracking-widest mb-2">No active threats detected</p>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto">Your protection layer is active. Traffic events will appear here once security decisions are triggered.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-white/3 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {incidents.length} Records Loaded
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            className="rounded-lg border border-white/5 bg-white/2 px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:bg-white/5 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed" 
            disabled
          >
            Previous
          </button>
          <button 
            className="rounded-lg border border-white/5 bg-white/2 px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:bg-white/5 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed" 
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
