import { kv } from '@vercel/kv';
import { createHash } from 'crypto';

const WINDOW_SECONDS = 24 * 60 * 60;

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function checkAndIncrement(
  ip: string,
  bucket: string,
  limit: number
): Promise<RateLimitResult> {
  const key = `rl:${bucket}:${hashIp(ip)}`;
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, WINDOW_SECONDS);
  }
  return {
    allowed: count <= limit,
    count,
    limit,
  };
}
