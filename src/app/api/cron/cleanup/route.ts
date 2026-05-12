import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/cron/cleanup
 * 
 * Weekly cleanup job:
 * - Delete incidents older than 90 days
 * - Deactivate expired global_blocklist feed entries
 * 
 * Auth: CRON_SECRET header validation
 * Schedule: 03:00 UTC every Sunday (configured in vercel.json)
 * 
 * Phase 0: Stub.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const supabase = await (async () => {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  })();

  try {
    console.log('[Cleanup] Starting weekly maintenance...');

    // 1. Delete incidents older than 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { count: incidentCount, error: incidentError } = await supabase
      .from('incidents')
      .delete({ count: 'exact' })
      .lt('created_at', ninetyDaysAgo);

    if (incidentError) throw incidentError;

    // 2. Deactivate expired global_blocklist entries
    const { count: feedCount, error: feedError } = await supabase
      .from('global_blocklist')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true);

    if (feedError) throw feedError;

    // Log the result
    await supabase.from('audit_log').insert({
      action: 'CLEANUP_JOB',
      metadata: {
        incidentsDeleted: incidentCount,
        feedsDeactivated: feedCount,
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      deletedIncidents: incidentCount,
      deactivatedFeeds: feedCount
    });
  } catch (err: any) {
    console.error('[Cleanup] Job failed:', err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
