import { RuleManager } from "@/components/dashboard/RuleManager";
import { createClient } from "@/lib/supabase/server";
import { ShieldAlert, ShieldCheck, ListFilter } from 'lucide-react';

export default async function RulesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [blockList, allowList] = await Promise.all([
    supabase.from('user_blocklist').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('user_allowlist').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  ]);

  const blockCount = blockList.data?.length || 0;
  const allowCount = allowList.data?.length || 0;

  return (
    <div className="animate-fade-in-up">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="status-badge bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-[10px]">
            <ListFilter className="w-3 h-3" />
            Custom Engine Overrides
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl heading-accent">Security Rules</h1>
        <p className="mt-2 text-sm text-zinc-500 max-w-xl font-medium">
          Configure personal overrides to the global intelligence engine. 
          Your personal lists take precedence over automated feed decisions.
        </p>
      </header>

      {/* Rules Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="p-4 rounded-2xl border border-red-500/10 bg-red-500/5 backdrop-blur-sm flex items-center justify-between group hover:border-red-500/20 transition-all">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Active Blocks</p>
            <h3 className="text-2xl font-black text-white">{blockCount}</h3>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-500/20 group-hover:text-red-500/40 transition-colors" />
        </div>
        <div className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 backdrop-blur-sm flex items-center justify-between group hover:border-emerald-500/20 transition-all">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Trusted Overrides</p>
            <h3 className="text-2xl font-black text-white">{allowCount}</h3>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" />
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 items-start">
        {/* Blocklist Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <h2 className="text-sm font-black text-white tracking-widest uppercase">Personal Blocklist</h2>
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-white/3 px-2 py-0.5 rounded border border-white/2">
              Strict Enforcement
            </span>
          </div>
          <RuleManager initialRules={blockList.data || []} type="block" />
        </section>

        {/* Allowlist Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h2 className="text-sm font-black text-white tracking-widest uppercase">Personal Allowlist</h2>
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-white/3 px-2 py-0.5 rounded border border-white/2">
              Global Bypass
            </span>
          </div>
          <RuleManager initialRules={allowList.data || []} type="allow" />
        </section>
      </div>
    </div>
  );
}
