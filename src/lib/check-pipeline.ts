import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { hashHostname, getTLD } from './utils/crypto';

// Service role client for reading blocklists across users efficiently
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface CheckResult {
  decision: 'blocked' | 'allowed' | 'suspicious';
  reason?: string;
  threat_score?: number;
  source: string;
  ttl: number;
}

/**
 * Optimized cache for Global Blocklist
 */
const getGlobalBlocklistEntry = unstable_cache(
  async (value: string) => {
    const { data } = await supabase
      .from('global_blocklist')
      .select('threat_category, severity, source')
      .eq('value', value)
      .eq('is_active', true)
      .single();
    return data;
  },
  ['global-blocklist'],
  { revalidate: 3600, tags: ['global-blocklist'] }
);

function isValidPublicHostname(hostname: string): boolean {
  // 1. Basic RFC format check
  const validFQDN = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
  if (!validFQDN.test(hostname)) return false;

  // 2. Private Range / Loopback / Link-Local checks (SSRF Prevention)
  const privateRanges = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fe80:)/i;
  if (privateRanges.test(hostname)) return false;

  return true;
}

/**
 * Main Decision Engine
 */
export async function evaluateRequest(
  hostname: string,
  userId: string,
  extensionId: string
): Promise<CheckResult> {
  const startTime = Date.now();

  // ── 0. Validate Hostname (SSRF Prevention) ──
  if (!isValidPublicHostname(hostname)) {
    return { 
      decision: 'blocked', 
      reason: 'invalid_hostname', 
      source: 'validation', 
      ttl: 3600 
    };
  }

  // ── 1. Check Personal Allowlist ──
  const { data: personalAllow } = await supabase
    .from('user_allowlist')
    .select('reason')
    .eq('user_id', userId)
    .eq('value', hostname)
    .single();

  if (personalAllow) {
    return { decision: 'allowed', source: 'user_allowlist', ttl: 3600 };
  }

  // ── 2. Check Personal Blocklist ──
  const { data: personalBlock } = await supabase
    .from('user_blocklist')
    .select('threat_category')
    .eq('user_id', userId)
    .eq('value', hostname)
    .single();

  if (personalBlock) {
    return { 
      decision: 'blocked', 
      reason: personalBlock.threat_category, 
      source: 'user_blocklist', 
      ttl: 86400 
    };
  }

  // ── 3. Check Global Blocklist (Ingested Feeds) ──
  const globalMatch = await getGlobalBlocklistEntry(hostname);
  if (globalMatch) {
    return {
      decision: globalMatch.severity >= 85 ? 'blocked' : 'suspicious',
      reason: globalMatch.threat_category,
      threat_score: globalMatch.severity,
      source: `global_blocklist:${globalMatch.source}`,
      ttl: 86400
    };
  }

  // ── 4. AbuseIPDB Live Enrichment ──
  const { getAbuseScore } = await import('./abuseipdb');
  const abuse = await getAbuseScore(hostname);

  let result: CheckResult = { decision: 'allowed', source: 'none', ttl: 3600 };

  if (abuse.score >= 85) {
    result = { 
      decision: 'blocked', 
      reason: 'malware', 
      threat_score: abuse.score, 
      source: 'abuseipdb', 
      ttl: 3600 
    };
  } else if (abuse.score >= 50) {
    result = { 
      decision: 'suspicious', 
      reason: 'suspicious_activity', 
      threat_score: abuse.score, 
      source: 'abuseipdb', 
      ttl: 1800 
    };
  } else if (abuse.usageLimitReached) {
    result = { decision: 'allowed', source: 'feed_only_fallback', ttl: 3600 };
  }

  // ── 5. Async Incident Logging ──
  // We use "fire and forget" to keep response times low
  const responseTime = Date.now() - startTime;
  
  if (result.decision !== 'allowed' || Math.random() < 0.05) { // Log all blocks + 5% of allows
    supabase.from('incidents').insert({
      user_id: userId,
      extension_id: extensionId,
      decision: result.decision,
      threat_category: result.reason,
      threat_score: result.threat_score,
      domain_hash: hashHostname(hostname),
      tld: getTLD(hostname),
      source: result.source,
      response_ms: responseTime
    }).then(({ error }) => {
      if (error) console.error('[Incident] Log failed:', error.message);
    });
  }

  return result;
}
