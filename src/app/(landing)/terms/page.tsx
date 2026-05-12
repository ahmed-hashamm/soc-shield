import { APP_CONFIG } from "@/lib/constants";
import { Scale, FileText, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${APP_CONFIG.name}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-16 border-b border-white/10 pb-8 text-center md:text-left">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">Terms of Service</h1>
        <p className="text-xl text-zinc-400">Effective Date: May 12, 2026</p>
      </div>

      <div className="grid gap-12 md:grid-cols-[1fr_300px]">
        <div className="space-y-16 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <Scale className="text-neon-blue h-5 w-5" />
              </div>
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using {APP_CONFIG.name}, including the website, dashboard, and browser extension, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our software and services.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <FileText className="text-neon-blue h-5 w-5" />
              </div>
              2. Use License
            </h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the extension for personal or internal enterprise viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-4 pl-6 border-l-2 border-neon-blue/30 text-zinc-400">
              <li><span className="text-neon-blue mr-2">▪</span> Modify or copy the core threat intelligence materials;</li>
              <li><span className="text-neon-blue mr-2">▪</span> Use the materials for any commercial purpose, or for any public display (commercial or non-commercial) without an enterprise agreement;</li>
              <li><span className="text-neon-blue mr-2">▪</span> Attempt to decompile or reverse engineer any software contained in the {APP_CONFIG.name} extension;</li>
              <li><span className="text-neon-blue mr-2">▪</span> Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <ShieldCheck className="text-neon-blue h-5 w-5" />
              </div>
              3. Disclaimer
            </h2>
            <p className="mb-4">
              The materials on {APP_CONFIG.name}'s website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-blue/10">
                <AlertTriangle className="text-neon-blue h-5 w-5" />
              </div>
              4. Limitations
            </h2>
            <p className="mb-4">
              In no event shall {APP_CONFIG.name} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the {APP_CONFIG.name} software.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
