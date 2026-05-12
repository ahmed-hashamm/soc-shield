import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

interface LogoProps {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className = "", iconSize = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg p-1",
    md: "h-10 w-10 rounded-xl p-1.5",
    lg: "h-16 w-16 rounded-2xl p-2.5 shadow-[0_0_30px_rgba(0,210,255,0.2)]",
  };

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className={`overflow-hidden border border-white/5 bg-white/2 transition-all group-hover:border-neon-blue/50 group-hover:bg-neon-blue/5 ${sizeClasses[iconSize]}`}>
        <img
          src="/logo-icon.png"
          alt={`${APP_CONFIG.name} Icon`}
          className="h-full w-full object-contain"
        />
      </div>
      {showText && (
        <div className="group-hover:translate-x-0.5 transition-transform">
          <h4 className={`font-bold tracking-tight text-white leading-tight ${iconSize === 'lg' ? 'text-xl' : 'text-sm'}`}>
            {APP_CONFIG.shortName}
          </h4>
          {/* <p className={`font-bold uppercase tracking-widest text-zinc-500 leading-tight ${iconSize === 'lg' ? 'text-[12px] mt-1' : 'text-[10px]'}`}>
            {APP_CONFIG.tagline}
          </p> */}
        </div>
      )}
    </Link>
  );
}
