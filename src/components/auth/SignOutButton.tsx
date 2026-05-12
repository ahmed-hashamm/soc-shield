'use client';

import { useState } from 'react';
import { signOut } from '@/lib/actions/auth';

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    await signOut();
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="rounded-xl border border-red-500/10 bg-red-500/5 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] disabled:opacity-50"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
      ) : (
        'Terminate Session'
      )}
    </button>
  );
}
