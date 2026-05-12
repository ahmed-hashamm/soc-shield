import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { IncidentRow } from "@/components/dashboard/IncidentRow";
import { FeedStatusCard } from "@/components/dashboard/FeedStatusCard";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { RecentIncidentsHeader } from "@/components/dashboard/RecentIncidentsHeader";
import { getDashboardStats, getRecentIncidents, getFeedHealth, getActivityData } from "@/lib/supabase/dashboard";
import { getDashboardStatsConfig } from "@/lib/constants/dashboard-data";
import Link from "next/link";

export default async function DashboardPage() {
  const [stats, incidents, feedHealth, activityData] = await Promise.all([
    getDashboardStats(),
    getRecentIncidents(6),
    getFeedHealth(),
    getActivityData()
  ]);

  const dashboardStats = getDashboardStatsConfig(stats);

  // Calculate max count for feed normalization
  const maxFeedCount = Math.max(...feedHealth.map(f => f.count), 1);

  return (
    <div className="space-y-8 pb-10">
      {/* ── Header ── */}
      <DashboardHeader />

      {/* ── Stats Section ── */}
      <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="border-x border-b border-white/5 rounded-b-2xl bg-white/1 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, i) => (
              <StatCard key={i} {...stat} isLast={i === dashboardStats.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-6 lg:grid-cols-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {/* Threat Activity Chart Block */}
        <div className="lg:col-span-8">
          <ActivityCard initialData={activityData} />
        </div>

        {/* Recent Incidents List */}
        <div className="lg:col-span-4">
          <div className="dashboard-card p-6 min-h-[450px] flex flex-col">
            <RecentIncidentsHeader />
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[320px] pr-2 scrollbar-thin">
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <IncidentRow key={incident.id} {...incident} />
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center py-10">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">No threats detected</p>
                </div>
              )}
            </div>
            <div className="pt-6 border-t border-white/3 mt-auto">
              <Link
                href="/dashboard/incidents"
                className="block w-full text-center text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer"
              >
                VIEW ALL LOGS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Intelligence Feeds Section ── */}
      {/* ── Intelligence Feeds Section ── */}
      <section className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold text-zinc-600 uppercase tracking-[0.3em] heading-accent">Intelligence Feeds</h2>
          </div>
        </header>
        
        <div className="border-x border-b border-white/5 rounded-b-2xl bg-white/1 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {feedHealth.map((feed, i) => (
              <FeedStatusCard 
                key={i} 
                {...feed} 
                maxCount={maxFeedCount} 
                isLast={i === feedHealth.length - 1} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
