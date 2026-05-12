'use client';

import { toast } from 'sonner';

export function RecentIncidentsHeader() {
  const handleFilter = () => {
    toast('Filter Active', {
      description: 'You can now filter by Threat Category, Source, or Country Code.',
      action: {
        label: 'Clear',
        onClick: () => console.log('Clear filters'),
      },
    });
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <h2 className="text-lg font-black text-white tracking-tight">Recent Incidents</h2>
      <button 
        onClick={handleFilter}
        className="px-3 py-1.5 rounded-lg border border-white/4 bg-white/1 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/4 hover:border-white/10 transition-all"
      >
        Filter
      </button>
    </header>
  );
}
