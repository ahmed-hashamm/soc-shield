import { NextRequest, NextResponse } from 'next/server';
import { runIngestion } from '@/lib/ingest/service';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // ── 1. Validate Cron Secret ──
  // Vercel sends the CRON_SECRET in the Authorization header as a Bearer token
  const authHeader = req.headers.get('authorization');
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (process.env.NODE_ENV === 'production' && authHeader !== expectedSecret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('[Cron] Starting feed ingestion...');
    const stats = await runIngestion();
    
    // ── 2. Bust Caches ──
    // Clear global blocklist and snapshot caches so extensions get new data
    revalidateTag('global-blocklist', 'max');
    revalidateTag('snapshot', 'max');

    return NextResponse.json({
      success: true,
      message: 'Feed ingestion completed',
      stats
    });
  } catch (err: any) {
    console.error('[Cron] Ingestion failed:', err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// Allow GET for easy manual testing in development (only)
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
  return POST(req);
}
