import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Architecture } from "@/components/landing/Architecture";
import { Feeds } from "@/components/landing/Feeds";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#050810] text-zinc-400 overflow-x-hidden font-sans selection:bg-blue-500/30">
      {/* ── Background ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-glow" />
        <div className="absolute top-[10%] right-[-10%] h-[45%] w-[30%] rounded-full bg-indigo-600/5 blur-[120px] animate-glow [animation-delay:2s]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Navbar />
      
      <main className="relative">
        <Hero />
        <Features />
        <Architecture />
        <Feeds />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
