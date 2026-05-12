import { APP_CONFIG } from "@/lib/constants";
import { Shield, Lock, Server, FileCheck, CheckCircle } from "lucide-react";

export const metadata = {
  title: 'Security',
  description: `Security practices and architecture of ${APP_CONFIG.name}.`,
};

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-blue/20 bg-neon-blue/10 shadow-[0_0_30px_rgba(0,210,255,0.15)]">
          <Shield className="h-10 w-10 text-neon-blue" />
        </div>
        <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">Security Posture</h1>
        <p className="mx-auto max-w-2xl text-xl text-zinc-400">
          We build security tools. Our own security posture must be impeccable. Here is how we protect your organization's data.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm transition-all hover:border-neon-blue/20 hover:bg-[#0a0f1c]">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
              <Lock className="h-6 w-6 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white">Client-Side Evaluation</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-6">
            Unlike legacy secure web gateways, we do not proxy your traffic. URL evaluation happens directly in your browser using local Bloom filters and Chrome's declarativeNetRequest API, ensuring sensitive data never leaves your device.
          </p>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> No Proxy Infrastructure</li>
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> No TLS Decryption</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm transition-all hover:border-neon-blue/20 hover:bg-[#0a0f1c]">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
              <Server className="h-6 w-6 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white">Zero Trust Architecture</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-6">
            Our backend utilizes Supabase Row Level Security (RLS). Every database query is cryptographically bound to the authenticated user's session. It is mathematically impossible for User A to access User B's incident logs.
          </p>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> Postgres RLS</li>
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> JWT Authentication</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm transition-all hover:border-neon-blue/20 hover:bg-[#0a0f1c]">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
              <Shield className="h-6 w-6 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white">Cryptographic Hashing</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-6">
            When a block event is logged to your dashboard, the requested domain is hashed using SHA-256 before transit. We store the hash, not the plaintext domain. Your browsing history remains your own.
          </p>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> SHA-256 One-Way Hashing</li>
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> No PII Logging</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm transition-all hover:border-neon-blue/20 hover:bg-[#0a0f1c]">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
              <FileCheck className="h-6 w-6 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white">API Authentication</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-6">
            The browser extension communicates with our APIs using short-lived JWTs signed with RS256 asynchronous keys. Tokens can be revoked instantly from your dashboard, killing unauthorized access immediately.
          </p>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> RS256 Signed Tokens</li>
            <li className="flex gap-2 items-center"><CheckCircle className="h-4 w-4 text-emerald-500" /> Instant Revocation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
