import { SectionHeader } from "./SectionHeader";
import { FeatureCard } from "./FeatureCard";
import { features } from "@/lib/constants/landing-data";

export function Features() {
  return (
    <section id="features" className="relative z-10 flex min-h-screen items-center border-t border-white/[0.04] py-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <SectionHeader
          badge="Engine"
          title="Defense in depth"
          description="Our architecture combines in-memory data structures with global intelligence to provide unparalleled security."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
}
