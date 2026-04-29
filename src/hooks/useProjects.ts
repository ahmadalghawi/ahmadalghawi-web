import { getAllProjects } from '../lib/repositories/projects';
import type { Project } from '../lib/types';
import { useSWR, type SWRResult } from './useSWR';

export type { FetchStatus } from './useSWR';

export function useProjects(): SWRResult<Project[]> {
  return useSWR<Project[]>('projects', getAllProjects);
}
