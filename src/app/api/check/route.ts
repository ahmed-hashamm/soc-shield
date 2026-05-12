import { NextRequest, NextResponse } from 'next/server';
import { evaluateRequest } from '@/lib/check-pipeline';
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
      // Return the 401 response from the validator, but ensure CORS headers are present
      const response = authResult;
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }
    const { userId, extensionId } = authResult;

    const { hostname, request_type } = await req.json();

    if (!hostname) {
      return NextResponse.json({ error: 'Missing hostname' }, { status: 400 });
    }

    // ── 2. Run Decision Pipeline ──
    console.log(`[Check] Evaluating ${hostname} for user ${userId}...`);
    const result = await evaluateRequest(hostname, userId, extensionId);

    // ── 3. Return Decision ──
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, max-age=${result.ttl}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('[Check API] Internal Error:', err.message);
    return NextResponse.json(
      { decision: 'allowed', source: 'error_fallback', error: err.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}
