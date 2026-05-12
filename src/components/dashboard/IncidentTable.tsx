import { formatDistanceToNow } from 'date-fns';
import { Incident } from '@/lib/supabase/dashboard';
import { Shield, ShieldAlert, ShieldCheck, Clock, Database, Globe } from 'lucide-react';

interface IncidentTableProps {
  incidents: Incident[];
}

export function IncidentTable({ incidents }: IncidentTableProps) {
  const getCategoryStyles = (cat: string | null) => {
    const base = "rounded-md border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300";
    switch (cat?.toLowerCase()) {
      case 'malware': return `${base} text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]`;
      case 'phishing': return `${base} text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]`;
      case 'c2': return `${base} text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]`;
      case 'cryptomining': return `${base} text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]`;
      case 'spam': return `${base} text-zinc-400 bg-zinc-500/10 border-zinc-500/20`;
      default: return `${base} text-neon-blue bg-neon-blue/10 border-neon-blue/20 shadow-[0_0_10px_rgba(0,210,255,0.1)]`;
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'blocked': return <ShieldAlert className="w-3.5 h-3.5 text-red-500" />;
      case 'suspicious': return <Shield className="w-3.5 h-3.5 text-amber-500" />;
      case 'allowed': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Shield className="w-3.5 h-3.5 text-zinc-500" />;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'blocked': return 'text-red-500';
      case 'suspicious': return 'text-amber-500';
      case 'allowed': return 'text-emerald-500';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
            <th className="px-8 py-5">Target Asset</th>
            <th className="px-6 py-5 text-center">Decision</th>
            <th className="px-6 py-5">Threat Intelligence</th>
            <th className="px-6 py-5">Source Node</th>
            <th className="px-8 py-5 text-right">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/4">
          {incidents.map((incident) => (
            <tr key={incident.id} className="group hover:bg-white/2 transition-all duration-300">
              <td className="px-8 py-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-white/3 border border-white/5 group-hover:border-neon-blue/20 group-hover:bg-neon-blue/5 transition-all duration-500">
                    <Globe className="w-4 h-4 text-zinc-600 group-hover:text-neon-blue transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-neon-blue transition-colors tracking-tight">
                      {incident.tld ? `***${incident.tld}` : `Hash: ${incident.domain_hash.slice(0, 12)}...`}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="w-1 h-1 rounded-full bg-zinc-600" />
                      <p className="text-[10px] text-zinc-500 font-mono tracking-tight">
                        UUID: {incident.extension_id?.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 border border-white/5 group-hover:border-white/8 transition-all">
                  {getDecisionIcon(incident.decision)}
                  <span className={`font-black uppercase tracking-widest text-[9px] ${getDecisionColor(incident.decision)}`}>
                    {incident.decision}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={getCategoryStyles(incident.threat_category)}>
                  {incident.threat_category || 'Neutral'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-white/2 border border-white/5 px-2.5 py-1 rounded-lg">
                  <Database className="w-3 h-3 opacity-40" />
                  {incident.source.replace('_', ' ')}
                </div>
              </td>
              <td className="px-8 py-4 text-right">
                <div className="flex items-center justify-end gap-2 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  <Clock className="w-3.5 h-3.5 opacity-40" />
                  <span className="text-[11px] font-bold tracking-tight">
                    {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
