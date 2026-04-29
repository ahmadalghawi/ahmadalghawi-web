/**
 * Stale-while-revalidate cache backed by localStorage.
 *
 * Returns cached data immediately (even if expired) so the UI paints fast,
 * then fires the fetcher in the background. When fresh data arrives, calls
 * `onUpdate` so the caller can re-render.
 *
 * Cache shape per key:
 *   { data: T, fetchedAt: number }    // ms since epoch
 *
 * TTL is used only to decide whether to skip the background refresh (if the
 * data is still "fresh enough"). Expired data is always returned from cache.
 */

const KEY_PREFIX = 'portfolio2026:cache:';
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

interface Envelope<T> {
  data: T;
  fetchedAt: number;
}

function readCache<T>(key: string): Envelope<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as Envelope<T>;
  } catch {
    return null;
  }
}

/**
 * Synchronously read cached data (for `useState` lazy init).
 * Returns null if nothing is cached. Never triggers a fetch.
 */
export function readCachedSync<T>(key: string): T | null {
  const env = readCache<T>(key);
  return env ? env.data : null;
}

function writeCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const envelope: Envelope<T> = { data, fetchedAt: Date.now() };
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(envelope));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function invalidateCache(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY_PREFIX + key);
}

/**
 * Invalidate every cached key — useful after admin writes.
 */
export function clearAllCaches(): void {
  if (typeof window === 'undefined') return;
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(KEY_PREFIX)) toRemove.push(k);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
}

interface SWROptions<T> {
  onUpdate: (data: T) => void;
  ttlMs?: number;
  /** Called if fetcher rejects AND no cache exists. */
  onError?: (err: unknown) => void;
}

/**
 * Stale-while-revalidate driver.
 *
 * Usage:
 *   const cached = swr('projects', fetchAllProjects, { onUpdate: setData });
 *   if (cached) setData(cached);  // instant paint
 *
 * Semantics:
 *   1. Returns cached data synchronously (even if stale) — may be null
 *   2. Schedules fetcher; on success caches + onUpdate(fresh) if changed
 *   3. Skips the fetch if cache is younger than ttlMs AND cache exists
 */
export function swr<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SWROptions<T>,
): T | null {
  const ttl = options.ttlMs ?? DEFAULT_TTL_MS;
  const cached = readCache<T>(key);
  const now = Date.now();
  const isFresh = cached && now - cached.fetchedAt < ttl;

  // Skip background refresh if cache is still fresh
  if (!isFresh) {
    fetcher()
      .then((fresh) => {
        // Only push update if the payload actually changed (avoid spurious re-renders)
        const cachedJson = cached ? JSON.stringify(cached.data) : null;
        const freshJson = JSON.stringify(fresh);
        writeCache(key, fresh);
        if (cachedJson !== freshJson) options.onUpdate(fresh);
      })
      .catch((err) => {
        if (!cached && options.onError) options.onError(err);
        // If we have cached data, swallow the error — stale data is better than nothing
      });
  }

  return cached ? cached.data : null;
}
