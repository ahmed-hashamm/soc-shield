import { createHash } from 'crypto';

/**
 * Generates a SHA-256 hash of a hostname for privacy-safe logging.
 * We store hashes instead of plain-text hostnames to prevent tracking user history.
 */
export function hashHostname(hostname: string): string {
  return createHash('sha256')
    .update(hostname.toLowerCase().trim())
    .digest('hex');
}

/**
 * Simple helper to extract TLD from hostname for analytics.
 */
export function getTLD(hostname: string): string {
  const parts = hostname.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : 'unknown';
}
