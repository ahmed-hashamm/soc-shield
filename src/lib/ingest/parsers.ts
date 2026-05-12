import { isValidIP, isValidDomain, isValidCIDR, normalizeValue } from './validation';

export interface FeedEntry {
  type: 'domain' | 'ip' | 'cidr';
  value: string;
  category: 'malware' | 'phishing' | 'c2' | 'spam' | 'exploit';
  source: string;
  severity: number;
}

/**
 * Parses Abuse.ch URLhaus text feed
 */
export function parseUrlhaus(text: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  
  text.split('\n').forEach(line => {
    const raw = line.trim();
    if (!raw || raw.startsWith('#')) return;

    let hostname = raw;
    try {
      if (raw.startsWith('http')) {
        hostname = new URL(raw).hostname;
      }
    } catch {
      hostname = raw;
    }

    const type = isValidIP(hostname) ? 'ip' : 'domain';
    const normalized = normalizeValue(hostname, type);

    if (type === 'ip' && isValidIP(normalized)) {
      entries.push({ type, value: normalized, category: 'malware', source: 'urlhaus', severity: 90 });
    } else if (type === 'domain' && isValidDomain(normalized)) {
      entries.push({ type, value: normalized, category: 'malware', source: 'urlhaus', severity: 90 });
    }
  });

  return entries;
}

/**
 * Parses Firehol Level 1 (netset format)
 */
export function parseFirehol(text: string): FeedEntry[] {
  const entries: FeedEntry[] = [];

  text.split('\n').forEach(line => {
    const raw = line.trim();
    if (!raw || raw.startsWith('#')) return;

    const type = raw.includes('/') ? 'cidr' : 'ip';
    const normalized = normalizeValue(raw, type);

    if (type === 'ip' && isValidIP(normalized)) {
      entries.push({ type, value: normalized, category: 'c2', source: 'firehol', severity: 95 });
    } else if (type === 'cidr' && isValidCIDR(normalized)) {
      entries.push({ type, value: normalized, category: 'c2', source: 'firehol', severity: 95 });
    }
  });

  return entries;
}

/**
 * Parses Emerging Threats (IP list)
 */
export function parseEmergingThreats(text: string): FeedEntry[] {
  const entries: FeedEntry[] = [];

  text.split('\n').forEach(line => {
    const raw = line.trim();
    if (!raw || raw.startsWith('#')) return;

    const normalized = normalizeValue(raw, 'ip');
    if (isValidIP(normalized)) {
      entries.push({ type: 'ip', value: normalized, category: 'spam', source: 'emerging_threats', severity: 80 });
    }
  });

  return entries;
}

/**
 * Parses CISA KEV
 */
export function parseCisaKev(json: any): FeedEntry[] {
  return [];
}
