import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export function CTA() {
  return (
    <section className="relative z-10 py-32 border-t border-white/4">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-6 text-3xl font-black text-white md:text-5xl tracking-tight">Ready to secure your browser?</h2>
        <p className="mb-10 text-zinc-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Join thousands of security professionals using {APP_CONFIG.shortName} today. 
          Deployment takes less than 2 minutes.
        </p>
        <Link href="/signup" className="group relative inline-block">
          <div className="absolute -inset-1 rounded-xl bg-neon-blue/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <button className="relative rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-10 py-4.5 text-[11px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_25px_rgba(0,210,255,0.4)]">
            Initialise Deployment
          </button>
        </Link>
      </div>
    </section>
  );
}
