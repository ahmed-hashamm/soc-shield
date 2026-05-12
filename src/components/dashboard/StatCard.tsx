import { LucideIcon, ArrowUpRight, Clock } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  statusText?: string;
  footerText: string;
  footerHighlight?: string;
  icon: LucideIcon;
  trend?: string;
  isLast?: boolean;
}

export function StatCard({
  label,
  value,
  description,
  statusText,
  footerText,
  footerHighlight,
  icon: Icon,
  trend,
  isLast
}: StatCardProps) {
  return (
    <div className="group relative p-6 flex flex-col h-full z-10 border-b border-white/7 sm:border-b-0 sm:border-r border-white/7 group-hover:border-white/15 last:border-b-0 sm:last:border-r-0 lg:border-r lg:last:border-r-0 hover:bg-neon-blue/[0.02] transition-all duration-500 ease-in-out">
      {/* Bottom Neon Accent Line (Visible on Hover) */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left shadow-[0_0_15px_#00d2ff]" />

      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-zinc-500/5 border border-zinc-500/10 group-hover:border-neon-blue/20 group-hover:bg-neon-blue/5 transition-all duration-500">
            <Icon className="w-4 h-4 text-zinc-500 group-hover:text-neon-blue transition-colors duration-500" />
          </div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{label}</h4>
        </div>

        {trend ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[7px] font-bold uppercase tracking-widest text-emerald-500">
            <ArrowUpRight className="w-2 h-2" />
            {trend}
          </div>
        ) : statusText && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-500/5 border border-zinc-500/10 text-[7px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-neon-blue group-hover:border-neon-blue/20 group-hover:bg-neon-blue/5 transition-all duration-500">
            {statusText}
          </div>
        )}
      </header>

      <div className="mb-6">
        <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
          {value}
        </h3>
        <p className="text-[10px] font-medium text-zinc-500 leading-relaxed max-w-[160px]">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-3 border-t border-white/2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-neon-blue animate-pulse" />
          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            {footerText}
          </p>
        </div>
        {footerHighlight && (
          <span className="text-[8px] font-black text-zinc-500 bg-white/3 px-2 py-0.5 rounded border border-white/2 uppercase tracking-tight">
            {footerHighlight}
          </span>
        )}
      </div>
    </div>
  );
}
