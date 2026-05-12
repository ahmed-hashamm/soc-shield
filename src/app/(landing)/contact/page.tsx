import { APP_CONFIG } from "@/lib/constants";
import { Mail, MessageSquare, MapPin, Globe } from "lucide-react";

export const metadata = {
  title: 'Contact Us',
  description: `Get in touch with the ${APP_CONFIG.name} team.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <div className="mb-20 text-center">
        <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">Get in Touch</h1>
        <p className="mx-auto max-w-2xl text-xl text-zinc-400">
          Whether you have a question about enterprise features, need technical support, or want to report a threat, our team is ready to help.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm transition-all hover:border-neon-blue/20">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
                <Mail className="h-6 w-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">General Inquiries</h3>
                <p className="text-zinc-400">support@socbrowsershield.com</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm transition-all hover:border-neon-blue/20">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
                <MessageSquare className="h-6 w-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise Sales</h3>
                <p className="text-zinc-400">sales@socbrowsershield.com</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm transition-all hover:border-neon-blue/20">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10">
                <Globe className="h-6 w-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Global Support</h3>
                <p className="text-zinc-400">Available 24/7 for Enterprise customers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0f1c]/50 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-bold text-white">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-400">Name</label>
              <input type="text" id="name" className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-400">Email</label>
              <input type="email" id="email" className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-zinc-400">Message</label>
              <textarea id="message" rows={4} className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="w-full rounded-lg bg-neon-blue px-4 py-3 font-semibold text-black transition-all hover:bg-neon-blue/90 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
