import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashHostname, getTLD } from '@/lib/utils/crypto';
import { validateExtensionRequest, isValidationError } from '@/lib/auth/validate-request';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Extract Identity from JWT ──
    const authResult = await validateExtensionRequest(req);
    if (isValidationError(authResult)) {
      const response = authResult;
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }
    const { userId, extensionId } = authResult;

    const { hostname, source, decision, threat_category } = await req.json();

    if (!hostname) {
      return NextResponse.json({ error: 'Missing hostname' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from('incidents').insert({
      user_id: userId,
      extension_id: extensionId,
      decision: decision || 'blocked',
      threat_category: threat_category || 'malware',
      threat_score: 95,
      domain_hash: hashHostname(hostname),
      tld: getTLD(hostname),
      source: source || 'global_blocklist',
      response_ms: 0
    });

    if (error) {
      console.error('[Incident Log] Supabase Error:', error.message);
      throw error;
    }

    return NextResponse.json({ success: true }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err: any) {
    console.error('[Incident Log API] Error:', err.message);
    return NextResponse.json(
      { error: err.message }, 
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
