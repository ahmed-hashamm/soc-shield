interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({ badge, title, description, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      {badge && (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-neon-blue">
          {badge}
        </p>
      )}
      <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className={`mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 ${centered ? '' : 'mx-0'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
