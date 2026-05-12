import { SectionHeader } from "./SectionHeader";
import { StepItem } from "./StepItem";
import { steps } from "@/lib/constants/landing-data";

export function Architecture() {
  return (
    <section id="architecture" className="relative z-10 flex min-h-screen items-center border-t border-white/4 bg-[#030508]/40 py-20">
      <div className="mx-auto max-w-5xl px-6 w-full">
        <SectionHeader
          badge="Infrastructure"
          title="The resolution pipeline"
          description="How every request is analyzed, verified, and resolved in less than 5 milliseconds."
        />
        <div className="mx-auto max-w-2xl mt-12">
          {steps.map((s, i) => (
            <StepItem key={i} {...s} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
