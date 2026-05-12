import { createClient } from '@supabase/supabase-js';
import { parseUrlhaus, parseFirehol, parseEmergingThreats, parseCisaKev, FeedEntry } from './parsers';

// Use service role key to bypass RLS for administrative ingestion
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FEEDS = [
  {
    url: 'https://urlhaus.abuse.ch/downloads/text/',
    parser: parseUrlhaus,
    name: 'URLhaus',
    format: 'text'
  },
  {
    url: 'https://iplists.firehol.org/files/firehol_level1.netset',
    parser: parseFirehol,
    name: 'Firehol Level 1',
    format: 'text'
  },
  {
    url: 'https://rules.emergingthreats.net/fwrules/emerging-Block-IPs.txt',
    parser: parseEmergingThreats,
    name: 'Emerging Threats',
    format: 'text'
  },
  {
    url: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
    parser: parseCisaKev,
    name: 'CISA KEV',
    format: 'json'
  }
];

export async function runIngestion() {
  const stats = {
    added: 0,
    updated: 0,
    failed: 0,
    deactivated: 0,
    durationMs: 0,
    details: [] as string[]
  };

  const startTime = Date.now();
  
  // Use a Map for cross-feed deduplication: value -> entry
  // This ensures that if the same IP/Domain is in multiple feeds, we only upsert it once
  // with the highest severity.
  const deduplicatedEntries = new Map<string, FeedEntry>();

  // 1. Fetch and parse all feeds
  for (const feed of FEEDS) {
    try {
      console.log(`[Ingest] Fetching ${feed.name}...`);
      const response = await fetch(feed.url, { next: { revalidate: 0 } });
      
      if (!response.ok) throw new Error(`Failed to fetch ${feed.name}: ${response.statusText}`);
      
      const data = feed.format === 'json' ? await response.json() : await response.text();
      const entries = feed.parser(data);
      
      entries.forEach(entry => {
        const key = `${entry.type}:${entry.value}`;
        const existing = deduplicatedEntries.get(key);
        
        if (!existing || entry.severity > existing.severity) {
          deduplicatedEntries.set(key, entry);
        }
      });
      
      stats.details.push(`Successfully parsed ${feed.name} (${entries.length} entries)`);
    } catch (err: any) {
      console.error(`[Ingest] Failed processing ${feed.name}:`, err.message);
      stats.failed++;
      stats.details.push(`Failed ${feed.name}: ${err.message}`);
    }
  }

  // 2. Upsert deduplicated entries in chunks
  const entriesArray = Array.from(deduplicatedEntries.values());
  console.log(`[Ingest] Total unique entries: ${entriesArray.length}. Starting upsert...`);

  const CHUNK_SIZE = 1000;
  for (let i = 0; i < entriesArray.length; i += CHUNK_SIZE) {
    const chunk = entriesArray.slice(i, i + CHUNK_SIZE);
    
    const { error } = await supabase
      .from('global_blocklist')
      .upsert(
        chunk.map(e => ({
          entry_type: e.type,
          value: e.value,
          threat_category: e.category,
          source: e.source,
          severity: e.severity,
          is_active: true,
          expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        })),
        { onConflict: 'entry_type,value' }
      );

    if (error) {
      console.error(`[Ingest] Error in chunk ${i}:`, error.message);
      stats.failed += chunk.length;
    } else {
      stats.added += chunk.length;
    }
  }

  // 3. Cleanup: Deactivate entries that have expired
  console.log('[Ingest] Running cleanup for expired entries...');
  const { data, error: cleanupError } = await supabase
    .from('global_blocklist')
    .update({ is_active: false })
    .lt('expires_at', new Date().toISOString())
    .eq('is_active', true)
    .select('id');

  if (cleanupError) {
    console.error('[Ingest] Cleanup failed:', cleanupError.message);
  } else {
    stats.deactivated = data?.length || 0;
    console.log(`[Ingest] Deactivated ${stats.deactivated} expired entries.`);
  }

  stats.durationMs = Date.now() - startTime;
  
  // Log the run to audit_log
  await supabase.from('audit_log').insert({
    action: 'INGEST_FEEDS',
    metadata: stats
  });

  return stats;
}
