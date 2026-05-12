import { APP_CONFIG } from "@/lib/constants";
import { ShieldAlert, Database, EyeOff, LockKeyhole } from "lucide-react";

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${APP_CONFIG.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-16 border-b border-white/10 pb-8">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">Privacy Policy</h1>
        <p className="text-xl text-zinc-400">Effective Date: May 12, 2026</p>
      </div>

      <div className="grid gap-16 md:grid-cols-[1fr_280px]">
        <div className="space-y-16 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <EyeOff className="text-neon-blue h-5 w-5" />
              </div>
              1. Introduction
            </h2>
            <p className="mb-4">
              At {APP_CONFIG.name}, privacy is not an afterthought—it is the foundational premise of our architecture. This Privacy Policy outlines our commitment to ensuring that your browsing activity remains entirely yours.
            </p>
            <p>
              Unlike legacy Secure Web Gateways (SWGs) that proxy and decrypt your traffic, our browser extension evaluates threats locally on your device. We do not proxy, intercept, or monitor your web traffic.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <Database className="text-neon-blue h-5 w-5" />
              </div>
              2. Information We Collect
            </h2>
            <p className="mb-6">We collect the absolute minimum amount of data required to provide our service:</p>
            <ul className="space-y-6 pl-6 border-l-2 border-neon-blue/30 text-zinc-400">
              <li><strong className="text-white block mb-1">Account Information:</strong> When you register, we collect your email address and authentication credentials via Supabase Auth.</li>
              <li><strong className="text-white block mb-1">Incident Telemetry:</strong> When the extension blocks a malicious site, it logs an incident to your dashboard. To protect your privacy, the domain name is cryptographically hashed (SHA-256) on your device before transit. We never receive or store the plaintext URL.</li>
              <li><strong className="text-white block mb-1">Custom Rules:</strong> If you add custom domain or IP rules to your personal blocklist or allowlist, those rules are stored securely in our database and isolated via Row Level Security (RLS).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <ShieldAlert className="text-neon-blue h-5 w-5" />
              </div>
              3. How We Use Your Information
            </h2>
            <p className="mb-4">The information we collect is used strictly for the following purposes:</p>
            <ul className="grid gap-3 text-zinc-400">
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-neon-blue"></span> To provide, operate, and maintain the {APP_CONFIG.name} dashboard.</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-neon-blue"></span> To authenticate your browser extensions and sync your custom rules.</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-neon-blue"></span> To provide you with analytics regarding the threats blocked on your specific devices.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <LockKeyhole className="text-neon-blue h-5 w-5" />
              </div>
              4. Data Security & Storage
            </h2>
            <p>
              All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Our database utilizes strict Row Level Security (RLS) policies, mathematically guaranteeing that no user can access another user's incident logs or custom rules.
            </p>
          </section>
        </div>

        <div className="hidden md:block">
          <div className="sticky top-32 rounded-2xl border border-white/5 bg-white/2 p-8 shadow-xl backdrop-blur-md">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6">Privacy TL;DR</h3>
            <ul className="space-y-5 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-neon-blue shrink-0" />
                <span>We do not track your browsing history.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-neon-blue shrink-0" />
                <span>Blocked domains are hashed before logging.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-neon-blue shrink-0" />
                <span>Zero third-party data selling or sharing.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-neon-blue shrink-0" />
                <span>Enterprise-grade encryption everywhere.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
