import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateExtensionRequest, isValidationError } from '@/lib/auth/validate-request';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Extension
    const validationResult = await validateExtensionRequest(req);
    if (isValidationError(validationResult)) {
      return validationResult;
    }

    const { userId, extensionId } = validationResult;
    const supabase = await createClient();

    // 2. Fetch Global Blocklist (active entries)
    const { data: globalEntries, error: globalError } = await supabase
      .from('global_blocklist')
      .select('value, threat_category, severity')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (globalError) throw globalError;

    // 3. Fetch User's Personal Blocklist
    const { data: userEntries, error: userError } = await supabase
      .from('user_blocklist')
      .select('value, threat_category')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (userError) throw userError;

    // 4. Combine and deduplicate
    const combined = [
      ...(globalEntries || []).map(e => ({ value: e.value, category: e.threat_category, source: 'global' })),
      ...(userEntries || []).map(e => ({ value: e.value, category: e.threat_category, source: 'personal' }))
    ];

    // In production, we would gzip this response
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      extension_id: extensionId,
      entries: combined,
      count: combined.length
    });

  } catch (err) {
    console.error('[Snapshot API] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
