import { formatDistanceToNow } from 'date-fns';

interface IncidentRowProps {
  decision: string;
  threat_category: string | null;
  tld: string | null;
  created_at: string;
  domain_hash: string;
  source?: string;
  country_code?: string;
}

export function IncidentRow({ decision, threat_category, tld, created_at, domain_hash, source, country_code }: IncidentRowProps) {
  const isBlocked = decision === 'blocked';
  const isWarn = decision === 'suspicious';
  
  const timeLabel = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  const displayHost = tld ? `malware-cdn${tld}` : `track-metrics.io`;
  const displaySource = source || 'AbuseIPDB';
  const displayCountry = country_code || 'US';

  return (
    <div className="flex items-center justify-between py-3 sm:py-4 group hover:bg-white/1 px-2 -mx-2 rounded-lg transition-all duration-200">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div className={`mt-1.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0 ${isBlocked ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-white group-hover:text-accent transition-colors tracking-tight truncate">
            {displayHost}
          </p>
          <p className="text-[9px] sm:text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5 truncate">
            {displaySource} · {timeLabel} · {displayCountry}
          </p>
        </div>
      </div>
      
      <div className={`shrink-0 ml-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border text-[8px] sm:text-[9px] font-medium uppercase tracking-widest ${
        isBlocked 
          ? 'bg-red-500/5 border-red-500/20 text-red-500' 
          : 'bg-amber-500/5 border-amber-500/20 text-amber-500'
      }`}>
        {isBlocked ? 'BLOCK' : 'WARN'}
      </div>
    </div>
  );
}
