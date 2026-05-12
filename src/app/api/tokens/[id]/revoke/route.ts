import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/tokens/[id]/revoke
 * 
 * Revoke an extension token. RLS ensures users can only revoke their own tokens.
 * Auth: Supabase session (member+)
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Revoke the token (RLS ensures ownership check)
  const { error, count } = await supabase
    .from('extension_tokens')
    .update({
      revoked: true,
      revoked_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to revoke token' },
      { status: 500 }
    );
  }

  if (count === 0) {
    return NextResponse.json(
      { error: 'Token not found or already revoked' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'Token revoked successfully',
    revoked_at: new Date().toISOString(),
  });
}
