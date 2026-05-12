'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addRule(type: 'block' | 'allow', value: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const entryType = value.match(/^(\d{1,3}\.){3}\d{1,3}$/) ? 'ip' : 'domain';
  const table = type === 'block' ? 'user_blocklist' : 'user_allowlist';
  
  const insertData: any = {
    user_id: user.id,
    value: value.toLowerCase().trim(),
    entry_type: entryType,
  };

  if (type === 'block') {
    insertData.threat_category = 'custom';
  } else {
    insertData.reason = 'User defined';
  }

  const { data, error } = await supabase
    .from(table)
    .insert(insertData)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('This rule already exists');
    throw error;
  }

  revalidatePath(`/dashboard/rules/${type === 'block' ? 'blocklist' : 'allowlist'}`);
  return data;
}

export async function deleteRule(type: 'block' | 'allow', id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const table = type === 'block' ? 'user_blocklist' : 'user_allowlist';
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Security check

  if (error) throw error;

  revalidatePath(`/dashboard/rules/${type === 'block' ? 'blocklist' : 'allowlist'}`);
  return { success: true };
}
