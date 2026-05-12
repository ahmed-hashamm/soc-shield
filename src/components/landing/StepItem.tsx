interface StepItemProps {
  step: string;
  title: string;
  desc: string;
  isLast?: boolean;
}

export function StepItem({ step, title, desc, isLast }: StepItemProps) {
  return (
    <div className="group relative flex gap-6 py-6">
      {!isLast && (
        <div className="absolute left-[21px] top-[60px] h-[calc(100%-30px)] w-px bg-linear-to-b from-neon-blue/30 via-neon-blue/10 to-transparent" />
      )}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neon-blue/20 bg-neon-blue/10 text-xs font-black text-neon-blue transition-colors group-hover:border-neon-blue/40 group-hover:bg-neon-blue/20">
        {step}
      </div>
      <div className="pt-1">
        <h3 className="mb-1 text-base font-bold text-white">{title}</h3>
        <p className="max-w-xl text-xs leading-relaxed text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}
