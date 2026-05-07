import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL || 'http://localhost:6379',
  token: process.env.REDIS_TOKEN || ''
});

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch {}
}

export async function cacheDelete(...keys: string[]): Promise<void> {
  try {
    if (keys.length === 1) {
      await redis.del(keys[0]);
    } else {
      await redis.del(...keys);
    }
  } catch {}
}

export async function invalidateDashboard(userId: string): Promise<void> {
  await cacheDelete(`dashboard:${userId}`, `user:${userId}:stats`);
}

export async function invalidateCatalogue(): Promise<void> {
  try {
    const keys = await redis.keys('catalogue:*');
    if (keys.length > 0) await redis.del(...keys);
  } catch {}
}

export { cacheGet as get, cacheSet as set, cacheDelete as del, invalidateDashboard as invalidate };
