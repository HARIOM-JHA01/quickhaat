import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

// Rate limiters for different use cases
export const rateLimiters = {
  // API routes - general
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'ratelimit:api',
    analytics: true,
  }),

  // Authentication routes - stricter
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'ratelimit:auth',
    analytics: true,
  }),

  // Cart operations
  cart: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    prefix: 'ratelimit:cart',
    analytics: true,
  }),

  // Search operations
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    prefix: 'ratelimit:search',
    analytics: true,
  }),

  // Order creation - very strict
  order: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'ratelimit:order',
    analytics: true,
  }),
};

// Helper to get identifier from request
export function getIdentifier(request: Request): string {
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'anonymous';
}

// Helper to apply rate limit
export async function applyRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending: Promise<unknown>;
}> {
  return await limiter.limit(identifier);
}
