import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Architecture } from "@/components/landing/Architecture";
import { Feeds } from "@/components/landing/Feeds";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Architecture />
      <Feeds />
      <Pricing />
      <CTA />
    </>
  );
}
