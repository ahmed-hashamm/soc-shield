"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

export function DownloadButton() {
  return (
    <button 
      onClick={() => toast.info("Coming soon to the Chrome Web Store!")}
      className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-neon-blue px-8 py-4 font-bold text-black transition-all hover:bg-neon-blue/90 hover:shadow-[0_0_20px_rgba(0,210,255,0.4)]"
    >
      <Download className="h-5 w-5" />
      Download for Chrome
    </button>
  );
}
