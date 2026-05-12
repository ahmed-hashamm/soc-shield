'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPreferences() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // If not found, try to create default
      try {
        const { data: newData, error: insertError } = await supabase
          .from('user_preferences')
          .insert({ 
            user_id: user.id,
            anonymized_logging: true,
            auto_cleanup_days: 90
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newData;
      } catch (e) {
        // Fallback to local defaults if insert fails (e.g. table doesn't exist)
        return {
          anonymized_logging: true,
          auto_cleanup_days: 90
        };
      }
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getPreferences error:', error);
    // Return safe defaults if anything fails (e.g. table doesn't exist)
    return {
      anonymized_logging: true,
      auto_cleanup_days: 90
    };
  }
}

export async function updatePreference(key: string, value: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const updateData = key === 'anonymized_logging' 
    ? { anonymized_logging: value }
    : { auto_cleanup_days: value ? 90 : 0 };

  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: user.id,
        ...updateData 
      }, { onConflict: 'user_id' });

    if (error) throw error;

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Preference update error:', error);
    if (error.code === '42P01') {
      throw new Error('Database table "user_preferences" is missing. Please run the required SQL migrations.');
    }
    throw new Error(error.message || 'Failed to update preferences');
  }
}
