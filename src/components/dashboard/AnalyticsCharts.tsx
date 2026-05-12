"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface AnalyticsData {
  threatCategories: { name: string; value: number }[];
  topTLDs: { name: string; value: number }[];
  blockSources: { name: string; value: number }[];
  weeklyTrend: { date: string; count: number }[];
}

interface Props {
  data: AnalyticsData;
}

const COLORS = ['#00d2ff', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export function AnalyticsCharts({ data }: Props) {
  const { threatCategories, topTLDs, blockSources, weeklyTrend } = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-xl">
          <p className="text-white font-bold text-sm mb-1">{label || payload[0].name}</p>
          <p className="text-neon-blue font-black text-xs uppercase tracking-widest">
            {payload[0].value} Blocks
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Weekly Trend (Spans full width) */}
      <div className="lg:col-span-2 bg-zinc-900/40 border border-white/4 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          7-Day Threat Activity
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#00d2ff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Threat Categories */}
      <div className="bg-zinc-900/40 border border-white/4 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          Threat Categories
        </h3>
        <div className="h-[250px] w-full flex items-center justify-center">
          {threatCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {threatCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No Data</div>
          )}
        </div>
      </div>

      {/* Top TLDs */}
      <div className="bg-zinc-900/40 border border-white/4 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          Top Targeted TLDs
        </h3>
        <div className="h-[250px] w-full">
          {topTLDs.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTLDs} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={10}
                  fontWeight="bold"
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {topTLDs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-zinc-600 text-sm font-bold uppercase tracking-widest">No Data</div>
          )}
        </div>
      </div>

      {/* Block Sources */}
      <div className="lg:col-span-2 bg-zinc-900/40 border border-white/4 rounded-2xl p-6 backdrop-blur-xl">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          Decision Sources
        </h3>
        <div className="h-[250px] w-full flex items-center justify-center">
          {blockSources.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={blockSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {blockSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">{value.replace('_', ' ')}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No Data</div>
          )}
        </div>
      </div>

    </div>
  );
}
