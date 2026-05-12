import { ShieldCheck, Activity, Clock } from "lucide-react";
import { FEED_DESCRIPTIONS } from "@/lib/constants/dashboard-data";

interface FeedStatusCardProps {
  name: string;
  count: number;
  last_sync: string;
  status: 'live' | 'healthy' | 'stale';
  maxCount?: number;
  isLast?: boolean;
}

export function FeedStatusCard({ name, count, last_sync, status, maxCount = 10000, isLast }: FeedStatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'live':
      case 'healthy': return '#10b981';
      case 'stale': return '#f59e0b';
      default: return '#71717a';
    }
  };

  const getStatusTextClass = () => 'text-zinc-500 group-hover:text-neon-blue';
  const getStatusBgClass = () => 'bg-zinc-500/5 border-zinc-500/10 group-hover:border-neon-blue/20 group-hover:bg-neon-blue/5';

  const rawPercentage = Math.min(100, Math.max(8, (count / maxCount) * 100));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rawPercentage / 100) * circumference;

  return (
    <div className="group relative p-6 flex flex-col h-full z-10 border-b border-white/7 sm:border-b-0 sm:border-r border-white/7 group-hover:border-white/15 last:border-b-0 sm:last:border-r-0 lg:border-r lg:last:border-r-0 hover:bg-neon-blue/[0.02] transition-all duration-500 ease-in-out">
      {/* Bottom Neon Accent Line (Visible on Hover) */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left shadow-[0_0_15px_#00d2ff]" />

      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${getStatusBgClass()} border transition-all duration-500`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${getStatusTextClass()} transition-colors duration-500`} />
          </div>
          <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{name}</h4>
        </div>

        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${getStatusBgClass()} border text-[7px] font-bold uppercase tracking-widest ${getStatusTextClass()} transition-all duration-500`}>
          <Activity className={`w-2 h-2 ${status === 'live' ? 'animate-pulse' : ''}`} />
          {status}
        </div>
      </header>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-3xl font-black text-white tracking-tight leading-none">
              {count.toLocaleString()}
            </h3>
          </div>
          <p className="text-[10px] font-medium text-zinc-500 leading-relaxed max-w-[140px]">
            {Object.entries(FEED_DESCRIPTIONS).find(([key]) => name.includes(key))?.[1] || FEED_DESCRIPTIONS.DEFAULT}
          </p>
        </div>

        {/* Circular Progress Indicator - Now using Neon Blue */}
        <div className="relative h-14 w-14 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-white/3"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#00d2ff"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all"
              filter="drop-shadow(0 0 6px rgba(0, 210, 255, 0.4))"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-white leading-none">{Math.round(rawPercentage)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-white/2 flex items-center gap-2">
        <Clock className="w-2.5 h-2.5 text-zinc-600" />
        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
          SYNC <span className="text-zinc-500 ml-1">{last_sync}</span>
        </p>
      </div>
    </div>
  );
}


