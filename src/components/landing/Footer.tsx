import { Logo } from "@/components/brand/Logo";
import { Github } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/4 bg-[#020408] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo iconSize="md" className="mb-6" />
            <p className="mb-8 max-w-xs text-sm leading-relaxed text-zinc-500">
              {APP_CONFIG.description}
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Github, href: 'https://github.com/ahmed-hashamm/soc-shield.git' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/4 bg-white/2 text-zinc-500 transition-all hover:border-neon-blue/50 hover:bg-neon-blue/5 hover:text-white"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            {[
              {
                title: 'Product',
                links: [
                  { label: 'Features', href: '/#features' },
                  { label: 'Architecture', href: '/#architecture' },
                  { label: 'Feeds', href: '/#feeds' },
                  { label: 'Rules', href: '/rules' },
                  { label: 'Extension', href: '/extension' }
                ]
              },
              {
                title: 'Company',
                links: [
                  { label: 'About', href: '/about' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Security', href: '/security' },
                  { label: 'Contact', href: '/contact' }
                ]
              },
              {
                title: 'Intelligence',
                links: [
                  { label: 'Abuse.ch', href: 'https://abuse.ch', external: true },
                  { label: 'Firehol', href: 'https://iplists.firehol.org/', external: true },
                  { label: 'Emerging Threats', href: 'https://rules.emergingthreats.net/', external: true },
                  { label: 'CISA KEV', href: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', external: true },
                  { label: 'API Docs', href: '/docs/api' }
                ]
              }
            ].map((section) => (
              <div key={section.title}>
                <h4 className="mb-6 text-[11px] font-bold uppercase tracking-widest text-white">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-sm text-zinc-500 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
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
