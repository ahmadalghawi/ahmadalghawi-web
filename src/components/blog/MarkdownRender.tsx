/**
 * Shared Markdown renderer with GFM, heading anchors, and Shiki-like
 * code blocks (styled via CSS since Shiki is heavy for runtime).
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Components } from 'react-markdown';

const components: Components = {
  h2({ children, ...props }) {
    return (
      <h2 id={props.id} className="text-xl font-semibold mt-10 mb-4 text-zinc-100 scroll-mt-24" {...props}>
        {children}
      </h2>
    );
  },
  h3({ children, ...props }) {
    return (
      <h3 id={props.id} className="text-lg font-semibold mt-8 mb-3 text-zinc-100 scroll-mt-24" {...props}>
        {children}
      </h3>
    );
  },
  p({ children, ...props }) {
    return <p className="mb-4 leading-7 text-zinc-300" {...props}>{children}</p>;
  },
  a({ children, href, ...props }) {
    return (
      <a href={href} className="text-cyan-400 hover:underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  ul({ children, ...props }) {
    return <ul className="list-disc list-inside mb-4 space-y-1 text-zinc-300" {...props}>{children}</ul>;
  },
  ol({ children, ...props }) {
    return <ol className="list-decimal list-inside mb-4 space-y-1 text-zinc-300" {...props}>{children}</ol>;
  },
  li({ children, ...props }) {
    return <li className="leading-7" {...props}>{children}</li>;
  },
  blockquote({ children, ...props }) {
    return (
      <blockquote className="border-l-2 border-cyan-500/40 bg-zinc-800/40 rounded-r-md pl-4 py-2 pr-3 mb-4 italic text-zinc-400" {...props}>
        {children}
      </blockquote>
    );
  },
  code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="mb-4 rounded-md overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-500 font-mono uppercase tracking-wide">
          <span>{match[1]}</span>
        </div>
        <pre className="bg-zinc-950 p-4 overflow-x-auto text-sm leading-relaxed">
          <code className={className} {...props}>{children}</code>
        </pre>
      </div>
    ) : (
      <code className="bg-zinc-800/60 px-1.5 py-0.5 rounded text-sm text-cyan-300 font-mono" {...props}>
        {children}
      </code>
    );
  },
  img({ src, alt, ...props }) {
    return <img src={src} alt={alt} className="rounded-lg border border-zinc-800 my-6 max-w-full" loading="lazy" {...props} />;
  },
  hr({ ...props }) {
    return <hr className="border-zinc-800 my-8" {...props} />;
  },
  table({ children, ...props }) {
    return (
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-zinc-800 rounded-md overflow-hidden" {...props}>
          {children}
        </table>
      </div>
    );
  },
  thead({ children, ...props }) {
    return <thead className="bg-zinc-900 text-zinc-200 font-medium" {...props}>{children}</thead>;
  },
  th({ children, ...props }) {
    return <th className="text-left px-3 py-2 border-b border-zinc-800" {...props}>{children}</th>;
  },
  td({ children, ...props }) {
    return <td className="px-3 py-2 border-b border-zinc-800/50 text-zinc-300" {...props}>{children}</td>;
  },
};

export default function MarkdownRender({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
