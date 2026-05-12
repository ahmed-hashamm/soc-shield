import { ShieldAlert, Rss, Zap, Laptop, LucideIcon } from "lucide-react";
import { DashboardStats } from "../supabase/dashboard";

export interface StatConfig {
  label: string;
  value: string | number;
  trend?: string;
  description: string;
  statusText?: string;
  footerText: string;
  footerHighlight?: string;
  icon: LucideIcon;
}

export const getDashboardStatsConfig = (stats: DashboardStats): StatConfig[] => [
  {
    label: 'BLOCKED THREATS',
    value: stats.blocked24h,
    trend: stats.blocked24hTrend,
    description: 'Malicious requests intercepted and neutralised',
    footerText: 'Last 24 hours',
    footerHighlight: `${stats.blockedThreats} lifetime`,
    icon: ShieldAlert,
  },
  {
    label: 'INTEL FEEDS ACTIVE',
    value: stats.activeFeedsCount || '4',
    statusText: 'Healthy',
    description: 'Active threat intelligence streams connected',
    footerText: 'All feeds synchronized',
    icon: Rss,
  },
  {
    label: 'AVG DECISION LATENCY',
    value: stats.avgLatency,
    statusText: 'Fast',
    description: 'Average response time for local evaluation',
    footerText: 'Per request',
    footerHighlight: 'Target < 150ms',
    icon: Zap,
  },
  {
    label: 'PROTECTED DEVICES',
    value: stats.protectedDevices,
    statusText: stats.protectedDevices > 0 ? 'Active' : 'Idle',
    description: 'Authorised browser instances currently active',
    footerText: 'active tokens issued',
    icon: Laptop,
  },
];

export const FEED_DESCRIPTIONS: Record<string, string> = {
  'CISA': 'Gov exploited infra',
  'URLHAUS': 'Active malware domains',
  'FIREHOL': 'IP reputation blocklist',
  'EMERGING': 'IDS confirmed threats',
  'DEFAULT': 'Real-time threat feeds'
};
