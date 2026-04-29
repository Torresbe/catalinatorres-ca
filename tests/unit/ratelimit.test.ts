import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkAndIncrement } from '@lib/ratelimit';

const mockKv = {
  store: new Map<string, { count: number; expiresAt: number }>(),
  get: vi.fn(),
  set: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
};

vi.mock('@vercel/kv', () => ({
  kv: {
    get: (key: string) => Promise.resolve(mockKv.store.get(key)?.count ?? null),
    set: (key: string, value: any, opts: { ex: number }) => {
      mockKv.store.set(key, { count: value, expiresAt: Date.now() + opts.ex * 1000 });
      return Promise.resolve('OK');
    },
    incr: (key: string) => {
      const existing = mockKv.store.get(key);
      const newCount = (existing?.count ?? 0) + 1;
      mockKv.store.set(key, { count: newCount, expiresAt: existing?.expiresAt ?? Date.now() + 86400000 });
      return Promise.resolve(newCount);
    },
    expire: (key: string, seconds: number) => {
      const existing = mockKv.store.get(key);
      if (existing) existing.expiresAt = Date.now() + seconds * 1000;
      return Promise.resolve(1);
    },
  },
}));

beforeEach(() => {
  mockKv.store.clear();
});

describe('checkAndIncrement', () => {
  it('allows first request', async () => {
    const result = await checkAndIncrement('test-ip', 'demo1', 2);
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(1);
  });

  it('allows up to limit', async () => {
    await checkAndIncrement('test-ip', 'demo1', 2);
    const second = await checkAndIncrement('test-ip', 'demo1', 2);
    expect(second.allowed).toBe(true);
    expect(second.count).toBe(2);
  });

  it('blocks requests after limit', async () => {
    await checkAndIncrement('test-ip', 'demo1', 2);
    await checkAndIncrement('test-ip', 'demo1', 2);
    const third = await checkAndIncrement('test-ip', 'demo1', 2);
    expect(third.allowed).toBe(false);
  });

  it('separates counters by bucket name', async () => {
    await checkAndIncrement('test-ip', 'demo1', 2);
    await checkAndIncrement('test-ip', 'demo1', 2);
    const fresh = await checkAndIncrement('test-ip', 'demo2', 2);
    expect(fresh.allowed).toBe(true);
    expect(fresh.count).toBe(1);
  });

  it('separates counters by IP', async () => {
    await checkAndIncrement('ip-a', 'demo1', 2);
    await checkAndIncrement('ip-a', 'demo1', 2);
    const other = await checkAndIncrement('ip-b', 'demo1', 2);
    expect(other.allowed).toBe(true);
  });
});
