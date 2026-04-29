import { getNow, type NowPayload } from '../lib/repositories/now';
import { useSWR, type SWRResult } from './useSWR';

export function useNow(): SWRResult<NowPayload> {
  return useSWR<NowPayload>('now', getNow);
}
