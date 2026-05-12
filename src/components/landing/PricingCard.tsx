import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

export function PricingCard({ name, price, period, features, cta, href, popular }: PricingCardProps) {
  return (
    <div className={`relative flex flex-col rounded-3xl p-8 transition-all ${popular ? 'bg-linear-to-b from-neon-blue/10 to-transparent border-2 border-neon-blue/50 shadow-[0_0_40px_rgba(0,210,255,0.15)] scale-105 z-10' : 'bg-white/2 border border-white/6 hover:border-white/15'}`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neon-blue px-4 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
          Most Popular
        </span>
      )}
      <div className="mb-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">{name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{price}</span>
          <span className="text-sm font-bold text-zinc-600">{period}</span>
        </div>
      </div>
      <div className="flex-1">
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-xs font-medium text-zinc-400">
              <svg className="h-3.5 w-3.5 text-neon-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <Link href={href} className={`mt-10 rounded-xl py-3 text-center text-[11px] font-black uppercase tracking-widest transition-all ${popular ? 'bg-neon-blue text-black hover:opacity-90 shadow-[0_0_20px_rgba(0,210,255,0.4)]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
        {cta}
      </Link>
    </div>
  );
}
