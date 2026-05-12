import { APP_CONFIG } from "@/lib/constants";
import { Filter, Zap, Database, ShieldAlert, Cpu } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: 'Rules Engine',
  description: `Learn how the ${APP_CONFIG.name} rules engine works.`,
};

export default function RulesEnginePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-blue/20 bg-neon-blue/10 shadow-[0_0_30px_rgba(0,210,255,0.15)]">
          <Filter className="h-10 w-10 text-neon-blue" />
        </div>
        <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">Rules Engine</h1>
        <p className="mx-auto max-w-2xl text-xl text-zinc-400">
          The core intelligence behind our browser protection. A multi-layered decision matrix that evaluates threats in under 150 milliseconds.
        </p>
      </div>

      <div className="mb-24 space-y-8">
        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/80 p-8 md:p-12 backdrop-blur-sm">
          <h2 className="mb-6 text-3xl font-bold text-white flex items-center gap-4">
            <Zap className="h-8 w-8 text-neon-blue" />
            Decision Flow
          </h2>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            Our rules engine is designed to be deterministic and incredibly fast. It evaluates every outbound browser request against a strict hierarchy of lists and dynamic threat intelligence feeds.
          </p>
          
          <div className="space-y-4">
            {[
              { step: 1, name: "Personal Allowlist", desc: "User-defined exceptions. Exits immediately if matched.", action: "ALLOW", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { step: 2, name: "Personal Blocklist", desc: "User-defined blocked domains. Exits immediately if matched.", action: "BLOCK", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
              { step: 3, name: "Global Allowlist", desc: "Admin-managed overrides to prevent false positives.", action: "ALLOW", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { step: 4, name: "Global Blocklist (Feeds)", desc: "Aggregated intelligence from CISA, Firehol, etc.", action: "BLOCK", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
              { step: 5, name: "Dynamic API (AbuseIPDB)", desc: "Real-time lookup for unknown entities.", action: "DYNAMIC", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            ].map((rule) => (
              <div key={rule.step} className="flex items-center gap-6 rounded-xl border border-white/5 bg-black/40 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 font-bold text-zinc-500">
                  {rule.step}
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-6">
                  <div>
                    <h4 className="font-semibold text-white">{rule.name}</h4>
                    <p className="text-sm text-zinc-500">{rule.desc}</p>
                  </div>
                  <div className={`w-fit rounded-md px-3 py-1 text-xs font-bold tracking-wider ${rule.color} ${rule.bg} ${rule.border} border`}>
                    {rule.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
              <Database className="h-6 w-6 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white">Feed Ingestion</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Every night at 02:00 UTC, our Vercel Cron jobs ingest the latest threat data from Abuse.ch, Firehol, Emerging Threats, and CISA. This data is normalized, deduplicated, and upserted into our global blocklist, ensuring you are protected against zero-day infrastructure.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
              <Cpu className="h-6 w-6 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white">Local Caching</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            To prevent latency, the extension utilizes Chrome's local storage and in-memory Bloom filters. The rules engine periodically generates a compressed snapshot of the blocklist, allowing the extension to block threats locally without waiting for a network request.
          </p>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="mb-6 text-2xl font-bold text-white">Ready to secure your endpoints?</h2>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center rounded-full bg-neon-blue px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-neon-blue/90 hover:shadow-[0_0_20px_rgba(0,210,255,0.4)]"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
