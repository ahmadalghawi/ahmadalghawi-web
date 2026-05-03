/**
 * Public blog listing page.
 */
import { BookOpen } from 'lucide-react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../blog/PostCard';
import { LoadingState, EmptyState } from '../admin/ui';

export default function Blog() {
  const { data: posts, status } = usePosts();

  const featured = posts?.filter((p) => p.featured && p.published) ?? [];
  const regular = posts?.filter((p) => !p.featured && p.published) ?? [];

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <title>Blog — Ahmad Alghawi</title>
      <meta name="description" content="Articles about web development, React, Firebase, and building performant portfolios." />
      <link rel="canonical" href={`${window.location.origin}/blog`} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen size={22} className="text-cyan-400" />
          <h1 className="text-3xl font-bold text-zinc-100">Blog</h1>
        </div>
        <p className="text-zinc-400 max-w-xl">
          Deep dives into web development, Firebase architecture, and the craft of building
          fast, accessible, SEO-friendly applications.
        </p>
      </header>

      {status === 'loading' && !posts ? (
        <LoadingState />
      ) : posts?.length === 0 ? (
        <EmptyState title="No posts yet" hint="Check back soon for new articles." />
      ) : (
        <div className="space-y-10">
          {featured.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featured.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {regular.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Latest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regular.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
