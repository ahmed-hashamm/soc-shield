interface FeedCardProps {
  name: string;
  type: string;
  format: string;
  desc: string;
}

export function FeedCard({ name, type, format, desc }: FeedCardProps) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/2 p-6 transition-all hover:border-white/15 hover:bg-white/5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-md bg-neon-blue/10 px-2 py-0.5 text-[10px] font-bold text-neon-blue">
          {format}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">Live</span>
        </span>
      </div>
      <h3 className="mb-1 text-sm font-bold text-white">{name}</h3>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
        {type}
      </p>
      <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
    </div>
  );
}
