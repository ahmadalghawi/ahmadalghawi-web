import { getPublishedPosts } from '../lib/repositories/posts';
import type { Post } from '../lib/types';
import { useSWR, type SWRResult } from './useSWR';

export type { FetchStatus } from './useSWR';

export function usePosts(): SWRResult<Post[]> {
  return useSWR<Post[]>('posts', getPublishedPosts);
}
