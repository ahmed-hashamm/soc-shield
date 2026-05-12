import { SectionHeader } from "./SectionHeader";
import { FeedCard } from "./FeedCard";
import { feeds } from "@/lib/constants/landing-data";

export function Feeds() {
  return (
    <section id="feeds" className="relative z-10 flex min-h-screen items-center border-t border-white/4 py-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <SectionHeader
          badge="Intelligence"
          title="Threat feeds"
          description="We ingest millions of indicators daily from the most trusted security organizations on the planet."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {feeds.map((f, i) => <FeedCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
}
