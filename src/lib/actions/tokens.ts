'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { signExtensionToken } from '@/lib/auth/jwt';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function issueToken(label: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // 1. Generate unique extension ID
  const extensionId = randomUUID();

  // 2. Sign JWT
  const token = await signExtensionToken(user.id, extensionId);

  // 3. Hash token for storage (last 32 chars as fingerprint)
  const tokenHash = await hash(token.slice(-32), 10);

  // 4. Store in database
  const { data, error } = await supabase
    .from('extension_tokens')
    .insert({
      user_id: user.id,
      extension_id: extensionId,
      token_hash: tokenHash,
      label: label || 'Default Extension',
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/dashboard/tokens');
  return { ...data, rawToken: token };
}

export async function revokeToken(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('extension_tokens')
    .update({ 
      revoked: true, 
      revoked_at: new Date().toISOString() 
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard/tokens');
  return { success: true };
}
