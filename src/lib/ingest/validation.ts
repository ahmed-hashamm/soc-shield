/**
 * Utility for validating and normalizing threat intelligence data.
 */

/**
 * Validates if a string is a valid IPv4 address.
 */
export function isValidIP(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * Validates if a string is a valid CIDR block.
 */
export function isValidCIDR(cidr: string): boolean {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  const ip = parts[0];
  const mask = parseInt(parts[1], 10);
  return isValidIP(ip) && mask >= 0 && mask <= 32;
}

/**
 * Validates if a string is a valid domain name.
 */
export function isValidDomain(domain: string): boolean {
  // RFC 1035/1123 compliant domain regex
  const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,63}$/;
  return domainRegex.test(domain);
}

/**
 * Normalizes a value based on its type.
 */
export function normalizeValue(value: string, type: 'ip' | 'domain' | 'cidr'): string {
  const trimmed = value.trim().toLowerCase();
  if (type === 'domain') {
    // Remove potential trailing dots
    return trimmed.replace(/\.$/, '');
  }
  return trimmed;
}
