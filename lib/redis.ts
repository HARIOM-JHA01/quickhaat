import { Redis } from '@upstash/redis';

// Initialize Redis client
export const redis = Redis.fromEnv();

// Cache durations in seconds
export const CACHE_TTL = {
  PRODUCT: 3600, // 1 hour
  PRODUCTS_LIST: 300, // 5 minutes
  CATEGORIES: 3600, // 1 hour
  CART: 1800, // 30 minutes
  SESSION: 86400, // 24 hours
} as const;

// Cache key prefixes
export const CACHE_KEYS = {
  PRODUCT: (slug: string) => `product:${slug}`,
  PRODUCTS_FEATURED: 'products:featured',
  PRODUCTS_CATEGORY: (categoryId: string) => `products:category:${categoryId}`,
  CATEGORIES: 'categories:all',
  CATEGORIES_TOP: 'categories:top',
  CART: (cartId: string) => `cart:${cartId}`,
} as const;

// Helper function to get or set cache
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, fetch and store
    const data = await fetcher();
    await redis.setex(key, ttl, data);
    return data;
  } catch (error) {
    console.error('Redis cache error:', error);
    // Fallback to fetcher if Redis fails
    return fetcher();
  }
}

// Helper function to invalidate cache
export async function invalidateCache(key: string | string[]): Promise<void> {
  try {
    if (Array.isArray(key)) {
      await redis.del(...key);
    } else {
      await redis.del(key);
    }
  } catch (error) {
    console.error('Redis cache invalidation error:', error);
  }
}

// Helper function to invalidate pattern-matched keys
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = Number(result[0]);
      if (result[1].length > 0) {
        await redis.del(...result[1]);
      }
    } while (cursor !== 0);
  } catch (error) {
    console.error('Redis cache pattern invalidation error:', error);
  }
}
