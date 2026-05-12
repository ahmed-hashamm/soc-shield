import { APP_CONFIG } from "@/lib/constants";
import { Globe, Shield, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { DownloadButton } from "./DownloadButton";

export const metadata = {
  title: 'Browser Extension',
  description: `Download the ${APP_CONFIG.name} Chrome extension.`,
};

export default function ExtensionPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-neon-blue/20 bg-neon-blue/10 shadow-[0_0_40px_rgba(0,210,255,0.2)]">
          <Globe className="h-12 w-12 text-neon-blue" />
        </div>
        <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">Browser Extension</h1>
        <p className="mx-auto max-w-2xl text-xl text-zinc-400 mb-10">
          The ultimate defense mechanism. A lightweight Chrome MV3 extension that blocks malicious traffic before it ever leaves your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <DownloadButton />
          <Link href="/dashboard/tokens" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10">
            Generate Token
          </Link>
        </div>
        <p className="mt-4 text-sm text-zinc-500">Requires a valid API token from your dashboard.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon-blue/10">
            <Zap className="h-8 w-8 text-neon-blue" />
          </div>
          <h3 className="mb-4 text-xl font-bold text-white">Zero Latency</h3>
          <p className="text-zinc-400">
            Powered by Chrome's declarativeNetRequest API and local Bloom filters, evaluations happen in under 5ms. No proxies, no slowdowns.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon-blue/10">
            <Shield className="h-8 w-8 text-neon-blue" />
          </div>
          <h3 className="mb-4 text-xl font-bold text-white">MV3 Compliant</h3>
          <p className="text-zinc-400">
            Built from day one to comply with Google's Manifest V3 architecture, ensuring maximum security, performance, and longevity.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon-blue/10">
            <Lock className="h-8 w-8 text-neon-blue" />
          </div>
          <h3 className="mb-4 text-xl font-bold text-white">Privacy First</h3>
          <p className="text-zinc-400">
            We don't inspect your payloads. We only evaluate hostnames, which are hashed before being logged to your dashboard.
          </p>
        </div>
      </div>

      <div className="mt-24 rounded-2xl border border-white/5 bg-black/40 p-8 md:p-12">
        <h2 className="mb-8 text-3xl font-bold text-white">Installation Guide</h2>
        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-blue/20 font-bold text-neon-blue">1</div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Create an Account</h4>
              <p className="text-zinc-400">Sign up for a free SOC Browser Shield account and navigate to your dashboard.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-blue/20 font-bold text-neon-blue">2</div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Generate a Token</h4>
              <p className="text-zinc-400">Go to the Tokens tab and generate a new access token. Copy this securely.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-blue/20 font-bold text-neon-blue">3</div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Install the Extension</h4>
              <p className="text-zinc-400">Download the extension from the Chrome Web Store and pin it to your toolbar.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-blue/20 font-bold text-neon-blue">4</div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Authenticate</h4>
              <p className="text-zinc-400">Click the extension icon, paste your generated token, and you're protected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
