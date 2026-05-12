import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Sliding window: 100 requests per 60 seconds per extension_id
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
  prefix: 'soc-shield',
});

/**
 * Rate limit check by extension ID.
 * Returns null if allowed, or a 429 response if rate limited.
 */
export async function checkRateLimit(
  extensionId: string
): Promise<NextResponse | null> {
  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(
      extensionId
    );

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null; // Allowed
  } catch (error) {
    // If Upstash is down, fail open (allow the request)
    console.error('Rate limit check failed:', error);
    return null;
  }
}
