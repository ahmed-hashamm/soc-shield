import { APP_CONFIG } from "@/lib/constants";
import { Shield, Globe, Zap, Users } from "lucide-react";

export const metadata = {
  title: 'About Us',
  description: `Learn more about ${APP_CONFIG.name} and our mission to secure the browser.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-20 text-center">
        <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-7xl">
          Securing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-blue-600">New Edge</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-zinc-400">
          The web browser is the operating system of the modern enterprise. We're building the intelligence layer to protect it.
        </p>
      </div>
      
      <div className="grid gap-16 md:grid-cols-2 lg:gap-24 items-center mb-32">
        <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
          <p>
            {APP_CONFIG.name} was born out of a simple realization: while corporate networks and endpoints are heavily guarded, the browser remains a glaringly vulnerable attack surface. Traditional Secure Web Gateways (SWGs) are slow, invasive, and break modern web applications.
          </p>
          <p>
            Our mission is to bring enterprise-grade Threat Intelligence directly to the browser, blocking malicious domains, phishing attempts, and malware distribution before a network connection is even established.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-neon-blue/20 blur-[100px] rounded-full" />
          <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1c]/80 p-8 backdrop-blur-xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">By the Numbers</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-black text-neon-blue mb-1">&lt; 2ms</div>
                <div className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Avg Latency</div>
              </div>
              <div>
                <div className="text-4xl font-black text-neon-blue mb-1">4+</div>
                <div className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Threat Feeds</div>
              </div>
              <div>
                <div className="text-4xl font-black text-neon-blue mb-1">100%</div>
                <div className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Client-Side</div>
              </div>
              <div>
                <div className="text-4xl font-black text-neon-blue mb-1">0</div>
                <div className="text-sm font-bold tracking-widest text-zinc-500 uppercase">Data Logged</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Core Values</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Privacy by Design",
              desc: "We don't want your data. Period. All evaluation happens locally via Chrome's declarativeNetRequest API."
            },
            {
              icon: Zap,
              title: "Zero Compromise",
              desc: "Security shouldn't slow you down. Our local Bloom filters evaluate threats in less than 2 milliseconds."
            },
            {
              icon: Globe,
              title: "Open Intelligence",
              desc: "We aggregate the best open-source threat feeds globally, democratizing access to enterprise security."
            }
          ].map((val, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/2 p-8 transition-colors hover:border-neon-blue/30 hover:bg-white/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-neon-blue/20 bg-neon-blue/10">
                <val.icon className="h-6 w-6 text-neon-blue" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{val.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
