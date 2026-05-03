import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';
import type { Post } from '../../lib/types';

export default function PostCard({ post }: { post: Post }) {
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  return (
    <article className="group bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/30 rounded-xl overflow-hidden transition-colors">
      {post.coverImage && (
        <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
          {date && <span>{date}</span>}
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} min read
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-2 group-hover:text-cyan-300 transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
      </div>
    </article>
  );
}
