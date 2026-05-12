'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { runIngestion } from '@/lib/ingest/service';

export async function syncFeedsManually() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify admin role if needed, but for now we'll allow any user to trigger a sync for demo purposes
  // In production, check: if (userRole !== 'admin') throw new Error('Forbidden');

  try {
    const results = await runIngestion();
    revalidatePath('/dashboard');
    return { success: true, results };
  } catch (error: any) {
    console.error('Manual sync error:', error);
    throw new Error(error.message || 'Failed to synchronize feeds');
  }
}
