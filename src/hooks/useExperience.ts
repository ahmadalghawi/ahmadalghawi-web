import { getAllExperience } from '../lib/repositories/experience';
import type { Experience } from '../lib/types';
import { useSWR, type SWRResult } from './useSWR';

export function useExperience(): SWRResult<Experience[]> {
  return useSWR<Experience[]>('experience', getAllExperience);
}
