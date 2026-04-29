import { useEffect, useState } from 'react';
import { readCachedSync, swr } from '../lib/cache';

export type FetchStatus = 'loading' | 'ok' | 'error';

export interface SWRResult<T> {
  data: T | null;
  status: FetchStatus;
  error: string | null;
}

/**
 * Generic stale-while-revalidate hook.
 *
 * - Reads cache synchronously via `useState` lazy initializer, so the initial
 *   render already paints with cached data (no cascading setState-in-effect).
 * - The effect only schedules the background revalidation and updates state
 *   when fresh data arrives or when there is no cache and the fetch fails.
 */
export function useSWR<T>(key: string, fetcher: () => Promise<T>): SWRResult<T> {
  const [data, setData] = useState<T | null>(() => readCachedSync<T>(key));
  const [status, setStatus] = useState<FetchStatus>(() =>
    readCachedSync<T>(key) !== null ? 'ok' : 'loading',
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    swr<T>(key, fetcher, {
      onUpdate: (fresh) => {
        setData(fresh);
        setStatus('ok');
        setError(null);
      },
      onError: (err) => {
        setError(String((err as Error)?.message ?? err));
        setStatus('error');
      },
    });
    // key + fetcher identity are expected to be stable per caller hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, status, error };
}
