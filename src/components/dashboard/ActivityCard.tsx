'use client';

import { useState } from 'react';
import { ActivityChart } from './ActivityChart';
import { BarChart2, TrendingUp } from 'lucide-react';

interface ActivityCardProps {
  initialData: { time: string; count: number; allowed?: number }[];
}

export function ActivityCard({ initialData }: ActivityCardProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // In a real app, this would fetch new data based on timeRange
  // For now, we use the initialData
  const hasData = initialData && initialData.length > 0 && initialData.some(d => d.count > 0);

  return (
    <div className="dashboard-card p-6 min-h-[450px] flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-neon-blue" strokeWidth={2.5} />
            <h2 className="text-lg font-black text-white tracking-tight heading-accent">Threat Activity</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            Security event detection over time
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white/2 rounded-xl border border-white/4">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] transition-all rounded-lg ${timeRange === range
                  ? 'text-white bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/6'
                  : 'text-zinc-600 hover:text-zinc-400 border border-transparent'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 w-full relative">
        {hasData ? (
          <div className="absolute inset-0">
            <ActivityChart data={initialData} />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/1 rounded-xl border border-dashed border-white/3">
            <div className="w-12 h-12 rounded-full bg-zinc-900/50 flex items-center justify-center mb-4 border border-white/5">
              <BarChart2 className="w-6 h-6 text-zinc-700" />
            </div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
              No security events detected in this period
            </p>
          </div>
        )}
      </div>

      <footer className="mt-6 pt-4 border-t border-white/3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Blocked Threats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500/50" />
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Allowed Traffic</span>
          </div>
        </div>
        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
          Last updated: 1m ago
        </p>
      </footer>
    </div>
  );
}
