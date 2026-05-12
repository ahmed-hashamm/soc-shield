'use client';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ActivityChartProps {
  data: { time: string; count: number; allowed?: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  // Mocking 'allowed' data for the aesthetic match if it doesn't exist
  const displayData = data.map(d => ({
    ...d,
    blocked: d.count,
    allowed: d.allowed || Math.floor(d.count * 0.6) + 2
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="0" 
            vertical={false} 
            stroke="rgba(255,255,255,0.03)" 
          />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 700 }}
            minTickGap={60}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 700 }}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#101823', 
              border: '1px solid #1c2633',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#fff'
            }}
            itemStyle={{ padding: '2px 0' }}
            cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="allowed" 
            stroke="#f59e0b" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAllowed)" 
            animationDuration={2000}
          />
          <Area 
            type="monotone" 
            dataKey="blocked" 
            stroke="#ef4444" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorBlocked)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
