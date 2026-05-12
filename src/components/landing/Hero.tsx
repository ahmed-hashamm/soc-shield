import Link from "next/link";
import { trustSignals } from "@/lib/constants/landing-data";
import { APP_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      {/* Animated Scanner Line */}
      <div className="pointer-events-none absolute inset-x-0 z-0 animate-scan">
        <div className="relative flex w-full flex-col items-center">
          {/* The Actual Scanner Line */}
          <div className="h-[1px] w-full bg-linear-to-r from-transparent via-neon-blue/60 to-transparent shadow-[0_0_20px_rgba(0,210,255,0.6)]" />
          
          {/* Symmetric Glows */}
          <div className="absolute bottom-[1px] h-32 w-full bg-linear-to-t from-neon-blue/15 to-transparent" />
          <div className="absolute top-[1px] h-32 w-full bg-linear-to-b from-neon-blue/15 to-transparent" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl animate-fade-in-up">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Infrastructure Secure
        </div>
        <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
          Neutralize threats<br />
          <span className="bg-linear-to-r from-neon-blue via-cyan-400 to-neon-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-glow">at the edge.</span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-zinc-500 md:text-base">
          Next-generation browser security powered by {APP_CONFIG.name}. 
          Real-time blocking, zero latency, and absolute privacy for your browsing data.
        </p>
        <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Link href="/signup" className="group relative w-full sm:w-auto">
            <div className="absolute -inset-1 rounded-xl bg-neon-blue/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <button className="relative w-full rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_25px_rgba(0,210,255,0.4)] sm:w-auto">
              Initialise Protection
            </button>
          </Link>
          <a href="#architecture" className="w-full rounded-xl border border-white/8 bg-white/2 px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all duration-300 hover:border-white/15 hover:bg-white/5 hover:text-white sm:w-auto">
            System Architecture
          </a>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          {trustSignals.map((text) => (
            <span key={text} className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-neon-blue/50" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
