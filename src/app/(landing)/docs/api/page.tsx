import { APP_CONFIG } from "@/lib/constants";
import { Terminal, Code, Database, Key } from "lucide-react";

export const metadata = {
  title: 'API Documentation',
  description: `Official API documentation for ${APP_CONFIG.name}.`,
};

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-20 text-center md:text-left border-b border-white/10 pb-8">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">API Documentation</h1>
        <p className="text-xl text-zinc-400">
          Integrate directly with the {APP_CONFIG.name} threat intelligence engine.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-[250px_1fr]">
        <div className="hidden md:block">
          <div className="sticky top-32 space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-bold tracking-wider text-zinc-500 uppercase">Getting Started</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#authentication" className="hover:text-neon-blue transition-colors">Authentication</a></li>
                <li><a href="#rate-limits" className="hover:text-neon-blue transition-colors">Rate Limits</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold tracking-wider text-zinc-500 uppercase">Endpoints</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#post-check" className="hover:text-neon-blue transition-colors">POST /api/check</a></li>
                <li><a href="#get-snapshot" className="hover:text-neon-blue transition-colors">GET /api/snapshot</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <section id="authentication" className="scroll-mt-32">
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <Key className="h-5 w-5 text-neon-blue" />
              </div>
              Authentication
            </h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              API endpoints utilized by the browser extension require a valid JSON Web Token (JWT) signed with our RS256 private key. You can generate an extension token from your dashboard. Send the token in the Authorization header.
            </p>
            <div className="rounded-lg border border-white/10 bg-black/50 p-4 font-mono text-sm text-zinc-300">
              Authorization: Bearer &lt;YOUR_EXTENSION_TOKEN&gt;
            </div>
          </section>

          <section id="rate-limits" className="scroll-mt-32">
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <Database className="h-5 w-5 text-neon-blue" />
              </div>
              Rate Limits
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              To prevent abuse, we employ a sliding window rate limiter via Upstash Redis. Each unique extension token is limited to <strong>100 requests per minute</strong>. Exceeding this limit will result in a <code>429 Too Many Requests</code> response. Replay attacks are mitigated by rejecting requests with timestamps older than 30 seconds.
            </p>
          </section>

          <hr className="border-white/10" />

          <section id="post-check" className="scroll-mt-32">
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
              <span className="inline-block rounded bg-neon-blue/20 px-3 py-1 text-sm font-bold text-neon-blue w-fit">POST</span>
              <h2 className="text-2xl font-bold text-white">/api/check</h2>
            </div>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              The core evaluation endpoint. Evaluates a hostname against your personal rules, the global feeds, and dynamic threat intelligence.
            </p>
            
            <h4 className="font-semibold text-white mb-4">Request Body</h4>
            <div className="rounded-xl border border-white/10 bg-black p-6 mb-8 overflow-x-auto">
              <pre className="text-sm text-zinc-300">
                <code>{`{
  "hostname": "suspicious-domain.ru",
  "request_type": "main_frame",
  "timestamp": 1716000000000
}`}</code>
              </pre>
            </div>

            <h4 className="font-semibold text-white mb-4">Response (Blocked)</h4>
            <div className="rounded-xl border border-white/10 bg-black p-6 mb-8 overflow-x-auto">
              <pre className="text-sm text-red-400">
                <code>{`{
  "decision": "blocked",
  "reason": "malware",
  "threat_score": 95,
  "source": "global_blocklist",
  "ttl": 86400
}`}</code>
              </pre>
            </div>

            <h4 className="font-semibold text-white mb-4">Response (Suspicious)</h4>
            <div className="rounded-xl border border-white/10 bg-black p-6 overflow-x-auto">
              <pre className="text-sm text-amber-400">
                <code>{`{
  "decision": "suspicious",
  "reason": "phishing",
  "threat_score": 68,
  "source": "abuseipdb",
  "ttl": 1800
}`}</code>
              </pre>
            </div>
          </section>

          <hr className="border-white/10" />

          <section id="get-snapshot" className="scroll-mt-32">
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
              <span className="inline-block rounded bg-emerald-500/20 px-3 py-1 text-sm font-bold text-emerald-500 w-fit">GET</span>
              <h2 className="text-2xl font-bold text-white">/api/snapshot</h2>
            </div>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Returns a compressed JSON payload containing the user's personal blocklist and allowlist, combined with the current global blocklist. This is polled by the extension every 6 hours to rebuild local Bloom filters for zero-latency evaluations.
            </p>
            <div className="rounded-lg border border-white/10 bg-[#0a0f1c]/50 p-6 flex items-start gap-4">
              <Terminal className="text-zinc-500 mt-1 shrink-0 h-5 w-5" />
              <p className="text-sm text-zinc-400">
                The response is <strong>gzip compressed</strong>. Ensure your client sends the <code>Accept-Encoding: gzip</code> header to properly process the payload, which can otherwise exceed several megabytes in raw JSON form.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
