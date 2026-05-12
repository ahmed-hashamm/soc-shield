import { SectionHeader } from "./SectionHeader";
import { PricingCard } from "./PricingCard";

export function Pricing() {
  return (
    <section id="pricing" className="relative z-10 flex min-h-screen items-center border-t border-white/4 bg-[#030508]/40 py-20">
      <div className="mx-auto max-w-7xl px-6 w-full">
        <SectionHeader
          badge="Access"
          title="SaaS without the cost"
          description="We believe security is a right, not a privilege. Our platform is free for the community."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center max-w-5xl mx-auto">
          <PricingCard 
            name="Community"
            price="$0"
            period="/month"
            features={[
              "Full threat feed protection",
              "Personal allow & block lists",
              "Real-time incident dashboard",
              "SHA-256 privacy hashing",
              "Community support"
            ]}
            cta="Get Started Free"
            href="/signup"
            popular
          />
          <PricingCard 
            name="Pro (Soon)"
            price="$12"
            period="/month"
            features={[
              "All Community features",
              "Advanced AbuseIPDB lookups",
              "Custom feed integration",
              "Team-wide policies",
              "Priority email support"
            ]}
            cta="Join Waitlist"
            href="/signup"
          />
          <PricingCard 
            name="Enterprise"
            price="Custom"
            period=""
            features={[
              "Dedicated infrastructure",
              "SIEM/SOAR integration",
              "SSO & Audit logs",
              "Custom RLS policies",
              "24/7 Phone support"
            ]}
            cta="Contact Sales"
            href="mailto:sales@socshield.com"
          />
        </div>
      </div>
    </section>
  );
}
