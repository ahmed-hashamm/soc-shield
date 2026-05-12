import { Shield, ShieldAlert, Zap, Globe, Clock, Server } from 'lucide-react';

interface IntelEntry {
  id: string;
  value: string;
  entry_type: string;
  threat_category: string;
  severity: number;
  source: string;
  expires_at: string | null;
}

interface IntelTableProps {
  entries: IntelEntry[];
}

export function IntelTable({ entries }: IntelTableProps) {
  const getSeverityStyles = (severity: number) => {
    if (severity >= 80) return { 
      text: 'text-red-500', 
      bg: 'bg-red-500', 
      border: 'border-red-500/20',
      shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]' 
    };
    if (severity >= 50) return { 
      text: 'text-amber-500', 
      bg: 'bg-amber-500', 
      border: 'border-amber-500/20',
      shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
    };
    return { 
      text: 'text-neon-blue', 
      bg: 'bg-neon-blue', 
      border: 'border-neon-blue/20',
      shadow: 'shadow-[0_0_12px_rgba(0,210,255,0.3)]' 
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
            <th className="px-8 py-5">Threat Indicator</th>
            <th className="px-6 py-5">Risk Vector</th>
            <th className="px-6 py-5">Classification</th>
            <th className="px-6 py-5">Intel Source</th>
            <th className="px-8 py-5 text-right">Expiry (UTC)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/4">
          {entries.map((entry) => {
            const styles = getSeverityStyles(entry.severity);
            return (
              <tr key={entry.id} className="group hover:bg-white/2 transition-all duration-300">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-white/3 border border-white/5 group-hover:border-neon-blue/20 group-hover:bg-neon-blue/5 transition-all duration-500">
                      {entry.entry_type === 'domain' ? 
                        <Globe className="w-4 h-4 text-zinc-600 group-hover:text-neon-blue transition-colors" /> : 
                        <Zap className="w-4 h-4 text-zinc-600 group-hover:text-neon-blue transition-colors" />
                      }
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-white group-hover:text-neon-blue transition-colors tracking-tight">
                        {entry.value}
                      </p>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">
                        {entry.entry_type}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 max-w-[60px] rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${styles.bg} ${styles.shadow} transition-all duration-1000`}
                        style={{ width: `${entry.severity}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-black w-6 ${styles.text}`}>{entry.severity}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/5 bg-white/2 text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                    <Shield className="w-3 h-3 opacity-30" />
                    {entry.threat_category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <Server className="w-3 h-3 opacity-30" />
                    {entry.source}
                  </div>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-zinc-500 font-medium">
                    <Clock className="w-3.5 h-3.5 opacity-30" />
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      {entry.expires_at ? new Date(entry.expires_at).toLocaleDateString() : 'Persistent'}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
