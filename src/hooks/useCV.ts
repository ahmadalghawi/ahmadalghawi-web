import { getCV } from '../lib/repositories/cv';
import type { CVDoc } from '../lib/types';
import { useSWR, type SWRResult } from './useSWR';

export function useCV(): SWRResult<CVDoc | null> {
  return useSWR<CVDoc | null>('cv', getCV);
}
