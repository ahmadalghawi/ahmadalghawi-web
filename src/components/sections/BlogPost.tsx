/**
 * Public blog post reader with TOC, related posts, and SEO meta.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Calendar, Share2 } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '../../lib/repositories/posts';
import type { Post } from '../../lib/types';
import MarkdownRender from '../blog/MarkdownRender';
import TableOfContents from '../blog/TableOfContents';
import PostCard from '../blog/PostCard';
import { LoadingState } from '../admin/ui';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [related, setRelated] = useState<Post[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPost(undefined);
    getPostBySlug(slug)
      .then((p) => {
        setPost(p);
        if (p) {
          getPublishedPosts().then((all) => {
            const rel = all
              .filter((x) => x.id !== p.id)
              .filter((x) => x.tags.some((t) => p.tags.includes(t)))
              .slice(0, 3);
            setRelated(rel);
          });
        }
      })
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) {
    return (
      <section className="max-w-5xl mx-auto py-10 px-4">
        <LoadingState />
      </section>
    );
  }

  if (post === null) {
    return (
      <section className="max-w-5xl mx-auto py-10 px-4 text-center">
        <title>Not found — Ahmad Alghawi</title>
        <meta name="robots" content="noindex" />
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Post not found</h1>
        <p className="text-zinc-400 mb-6">The article you are looking for does not exist.</p>
        <Link to="/blog" className="text-cyan-400 hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Back to blog
        </Link>
      </section>
    );
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const canonical = `${window.location.origin}/blog/${post.slug}`;
  const { title, excerpt, coverImage } = post;

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title, text: excerpt, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
    }
  }

  const progressStyle = { '--prog': `${progress}%` } as CSSProperties;

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      {/* React 19 native head hoisting */}
      <title>{`${post.title} — Ahmad Alghawi`}</title>
      <meta name="description" content={post.excerpt} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonical} />
      {coverImage && <meta property="og:image" content={coverImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          author: { '@type': 'Person', name: 'Ahmad Alghawi' },
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          image: post.coverImage,
          url: canonical,
          publisher: { '@type': 'Person', name: 'Ahmad Alghawi' },
        })}
      </script>

      {/* Reading progress bar — width driven by CSS custom property */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-800 z-50">
        <div
          className="h-full bg-cyan-400 transition-all duration-150 reading-progress"
          style={progressStyle}
        />
      </div>

      <div className="flex gap-10">
        {/* Main content */}
        <article className="flex-1 min-w-0">
          <Link to="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to blog
          </Link>

          {post.coverImage && (
            <div className="aspect-video rounded-xl overflow-hidden border border-zinc-800 mb-8">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-100 mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              {date && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {date}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readingTime} min read
                </span>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer bg-transparent border-none"
                aria-label="Share article"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <MarkdownRender>{post.content}</MarkdownRender>
        </article>

        {/* TOC sidebar — key forces remount on slug change so headings rebuild */}
        <TableOfContents key={post.slug} />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Related posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
