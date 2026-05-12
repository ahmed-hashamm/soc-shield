import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AbuseScore {
  score: number;
  isWhitelisted: boolean;
  usageLimitReached: boolean;
}

/**
 * Checks if we have AbuseIPDB quota remaining for today.
 */
async function checkQuota(): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('api_quota')
    .select('used, limit_val')
    .eq('api_name', 'abuseipdb')
    .eq('date', today)
    .single();

  if (error || !data) {
    // If no record exists for today, create one
    await supabase.from('api_quota').insert({ date: today });
    return true;
  }

  return data.used < data.limit_val;
}

/**
 * Increments the daily quota usage.
 */
async function incrementUsage() {
  const today = new Date().toISOString().split('T')[0];
  await supabase.rpc('increment_api_quota', { name_param: 'abuseipdb', date_param: today });
}

/**
 * Performs a live reputation check on AbuseIPDB.
 */
export async function getAbuseScore(ipOrDomain: string): Promise<AbuseScore> {
  const quotaAvailable = await checkQuota();
  
  if (!quotaAvailable) {
    return { score: 0, isWhitelisted: false, usageLimitReached: true };
  }

  try {
    const apiKey = process.env.ABUSEIPDB_API_KEY;
    if (!apiKey) throw new Error('Missing AbuseIPDB API Key');

    // For simplicity, we check IP reputation. 
    // In production, you'd resolve domain -> IP first if needed.
    const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ipOrDomain}`, {
      headers: { 'Key': apiKey, 'Accept': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) throw new Error('AbuseIPDB API Error');

    const { data } = await response.json();
    
    // Track usage
    await incrementUsage();

    return {
      score: data.abuseConfidenceScore,
      isWhitelisted: data.isWhitelisted,
      usageLimitReached: false
    };
  } catch (err) {
    console.error('[AbuseIPDB] Check failed:', err);
    return { score: 0, isWhitelisted: false, usageLimitReached: false };
  }
}
