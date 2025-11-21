import { NextResponse } from 'next/server';

export function setCacheHeaders(
  response: NextResponse,
  maxAge: number = 3600,
  staleWhileRevalidate: number = 86400
) {
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  );
  return response;
}

export function setNoCacheHeaders(response: NextResponse) {
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

// Cache durations in seconds
export const CACHE_DURATIONS = {
  SHORT: 300, // 5 minutes
  MEDIUM: 3600, // 1 hour
  LONG: 86400, // 24 hours
  WEEK: 604800, // 7 days
};
