import Link from "next/link";
import { MessageSquare, Globe, Share2, Shield } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/4 bg-[#020408] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-3 group">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/5 bg-white/2 p-1.5 transition-all group-hover:border-neon-blue/50 group-hover:bg-neon-blue/5">
                <img src="/logo-icon.png" alt={`${APP_CONFIG.name} Icon`} className="h-full w-full object-contain" />
              </div>
              <div className="group-hover:translate-x-0.5 transition-transform">
                <h4 className="text-sm font-bold tracking-tight text-white leading-tight">{APP_CONFIG.shortName}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-tight">{APP_CONFIG.tagline}</p>
              </div>
            </Link>
            <p className="mb-8 max-w-xs text-sm leading-relaxed text-zinc-500">
              {APP_CONFIG.description}
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: MessageSquare, href: '#' },
                { icon: Globe, href: '#' },
                { icon: Share2, href: '#' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/4 bg-white/2 text-zinc-500 transition-all hover:border-neon-blue/50 hover:text-white"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            {[
              {
                title: 'Product',
                links: ['Features', 'Architecture', 'Feeds', 'Rules', 'Extension']
              },
              {
                title: 'Company',
                links: ['About', 'Privacy Policy', 'Terms of Service', 'Security', 'Contact']
              },
              {
                title: 'Intelligence',
                links: ['Abuse.ch', 'Firehol', 'Emerging Threats', 'CISA KEV', 'API Docs']
              }
            ].map((section) => (
              <div key={section.title}>
                <h4 className="mb-6 text-[11px] font-bold uppercase tracking-widest text-white">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-white">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between border-t border-white/4 pt-8 md:flex-row">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
            {APP_CONFIG.copyright}
          </p>
          <div className="mt-4 flex items-center gap-6 md:mt-0">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">
              <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
