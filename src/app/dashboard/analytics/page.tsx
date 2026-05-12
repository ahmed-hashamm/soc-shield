import { getAnalyticsData } from "@/lib/supabase/dashboard";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { ExportPDFButton } from "@/components/dashboard/ExportPDFButton";
import { ShieldAlert, Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();

  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-xl font-black text-white uppercase tracking-widest">No Analytics Data</h2>
        <p className="text-sm text-zinc-500 mt-2">No incidents recorded in the last 30 days.</p>
      </div>
    );
  }

  return (
    <div id="analytics-dashboard" className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20 p-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-neon-blue" />
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Threat Analytics</h1>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Insights from the last 30 days</p>
        </div>
        
        <ExportPDFButton data={analyticsData} />
      </div>

      <AnalyticsCharts data={analyticsData} />
    </div>
  );
}
