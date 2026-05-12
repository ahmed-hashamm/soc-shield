/**
 * Generate RS256 key pair for extension JWT signing.
 * 
 * Run this script ONCE to generate your keys:
 *   node scripts/generate-keys.mjs
 * 
 * Then copy the output into your .env.local file.
 */

import { generateKeyPair, exportPKCS8, exportSPKI } from 'jose';

async function main() {
  const { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true });

  const privatePem = await exportPKCS8(privateKey);
  const publicPem = await exportSPKI(publicKey);

  console.log('═══════════════════════════════════════════');
  console.log('RS256 Key Pair Generated Successfully');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('Copy these into your .env.local file:');
  console.log('');
  console.log('─── PRIVATE KEY (keep secret!) ───');
  console.log(`JWT_PRIVATE_KEY="${privatePem.replace(/\n/g, '\\n')}"`);
  console.log('');
  console.log('─── PUBLIC KEY ───');
  console.log(`JWT_PUBLIC_KEY="${publicPem.replace(/\n/g, '\\n')}"`);
  console.log('');
  console.log('═══════════════════════════════════════════');
}

main().catch(console.error);
