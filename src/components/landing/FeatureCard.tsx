interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
}

export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-white/6 bg-white/2 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/5">
      <div className="mb-4 text-2xl">{icon}</div>
      <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
        {desc}
      </p>
    </div>
  );
}
