import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signExtensionToken } from '@/lib/auth/jwt';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

/**
 * POST /api/tokens
 * 
 * Issue a new extension token for the current authenticated user.
 * Auth: Supabase session (member+)
 * 
 * Request body:
 * { "label": "Work laptop" }  // optional friendly name
 * 
 * Response:
 * { "token": "eyJ...", "extension_id": "abc-123", "label": "Work laptop" }
 * 
 * The token is shown ONCE. We only store its bcrypt hash.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  // Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Parse body
  const body = await request.json().catch(() => ({}));
  const label = body.label || 'Default Extension';

  // Generate extension ID
  const extensionId = randomUUID();

  // Sign JWT
  const token = await signExtensionToken(user.id, extensionId);

  // Hash token for storage
  const tokenHash = await hash(token.slice(-32), 10); // Hash last 32 chars as fingerprint

  // Store in database
  const { error: insertError } = await supabase
    .from('extension_tokens')
    .insert({
      user_id: user.id,
      extension_id: extensionId,
      token_hash: tokenHash,
      label,
    });

  if (insertError) {
    console.error('Failed to store token:', insertError);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }

  // Return token — shown only once
  return NextResponse.json({
    token,
    extension_id: extensionId,
    label,
    message: 'Save this token securely. It will not be shown again.',
  });
}

/**
 * GET /api/tokens
 * 
 * List all extension tokens for the current user.
 * Does NOT return the actual token values (we don't store them).
 */
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data: tokens, error } = await supabase
    .from('extension_tokens')
    .select('id, extension_id, label, issued_at, last_seen_at, revoked, revoked_at')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }

  return NextResponse.json({ tokens });
}
