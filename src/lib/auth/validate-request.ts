import { NextRequest, NextResponse } from 'next/server';
import { verifyExtensionToken, type ExtensionTokenPayload } from './jwt';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ValidatedRequest {
  userId: string;
  extensionId: string;
  payload: ExtensionTokenPayload;
}

/**
 * Validates an incoming extension API request.
 * 
 * 1. Extracts JWT from Authorization header
 * 2. Verifies RS256 signature
 * 3. Checks token is not revoked in database
 * 4. Rejects replay attacks (timestamp > 30s old)
 * 
 * Returns the validated user info or a 401 response.
 */
export async function validateExtensionRequest(
  request: NextRequest
): Promise<ValidatedRequest | NextResponse> {
  // 1. Extract token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);

  // 2. Verify JWT signature + expiration
  let payload: ExtensionTokenPayload;
  try {
    payload = await verifyExtensionToken(token);
  } catch {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // 3. Replay protection: reject timestamps older than 30 seconds
  if (request.method === 'POST') {
    const body = await request.clone().json().catch(() => ({}));
    if (body.timestamp) {
      const requestAge = Date.now() - body.timestamp;
      if (requestAge > 30_000) {
        return NextResponse.json(
          { error: 'Request timestamp too old (replay protection)' },
          { status: 401 }
        );
      }
    }
  }

  // 4. Check token revocation in database
  const supabase = createAdminClient();
  const { data: tokenRecord } = await supabase
    .from('extension_tokens')
    .select('revoked')
    .eq('extension_id', payload.ext)
    .eq('user_id', payload.sub)
    .single();

  if (!tokenRecord || tokenRecord.revoked) {
    return NextResponse.json(
      { error: 'Token has been revoked' },
      { status: 401 }
    );
  }

  // 5. Update last_seen_at (fire-and-forget)
  supabase
    .from('extension_tokens')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('extension_id', payload.ext)
    .eq('user_id', payload.sub)
    .then(() => { /* no-op */ });

  return {
    userId: payload.sub,
    extensionId: payload.ext,
    payload,
  };
}

/**
 * Type guard to check if validation result is an error response.
 */
export function isValidationError(
  result: ValidatedRequest | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
