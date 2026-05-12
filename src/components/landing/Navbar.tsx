import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/4 bg-[#050810]/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 overflow-hidden rounded-xl border border-white/5 bg-white/2 p-1.5 transition-all group-hover:border-neon-blue/50 group-hover:bg-neon-blue/5">
            <img src="/logo-icon.png" alt={`${APP_CONFIG.name} Icon`} className="h-full w-full object-contain" />
          </div>
          <div className="group-hover:translate-x-0.5 transition-transform">
            <h4 className="text-sm font-bold tracking-tight text-white leading-tight">{APP_CONFIG.shortName}</h4>
            {/* <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500 leading-tight">{APP_CONFIG.tagline}</p> */}
          </div>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {['Features', 'Architecture', 'Feeds', 'Pricing'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-white">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <Link href="/dashboard" className="rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,210,255,0.4)]">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Log In</Link>
              <Link href="/signup" className="rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,210,255,0.4)]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
