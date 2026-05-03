/**
 * AdminDashboard — landing screen with quick stats per collection.
 * Uses the existing public hooks so the data is already cached.
 */
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  Sparkles,
  Inbox,
  FileText,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useExperience } from '../../hooks/useExperience';
import { useTestimonials } from '../../hooks/useTestimonials';
import { useNow } from '../../hooks/useNow';
import { useCV } from '../../hooks/useCV';
import { getAllMessages } from '../../lib/repositories/messages';
import { getAllPosts } from '../../lib/repositories/posts';

interface StatCardProps {
  to: string;
  label: string;
  count: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  hint?: string;
}

function StatCard({ to, label, count, icon: Icon, hint }: StatCardProps) {
  return (
    <Link
      to={to}
      className="group bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/40 rounded-xl p-5 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Icon size={16} className="text-cyan-300" />
        </div>
        <ArrowRight size={14} className="text-zinc-600 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="text-2xl font-semibold tracking-tight">{count}</div>
      <div className="text-sm text-zinc-400 mt-0.5">{label}</div>
      {hint && <div className="text-[11px] text-zinc-600 mt-1.5">{hint}</div>}
    </Link>
  );
}

export default function AdminDashboard() {
  const { data: projects } = useProjects();
  const { data: experience } = useExperience();
  const { data: testimonials } = useTestimonials();
  const { data: now } = useNow();
  const { data: cv } = useCV();

  const [msgCount, setMsgCount] = useState<number | null>(null);
  const [msgUnread, setMsgUnread] = useState(0);
  const [postCount, setPostCount] = useState<number | null>(null);
  const [postPublished, setPostPublished] = useState(0);
  useEffect(() => {
    getAllMessages()
      .then((msgs) => {
        setMsgCount(msgs.length);
        setMsgUnread(msgs.filter((m) => !m.read).length);
      })
      .catch(() => {
        /* silently ignore — user will see on messages page */
      });
    getAllPosts()
      .then((posts) => {
        setPostCount(posts.length);
        setPostPublished(posts.filter((p) => p.published).length);
      })
      .catch(() => {
        /* silently ignore — user will see on blog page */
      });
  }, []);

  return (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Overview of your portfolio content. Click any card to manage.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          to="/admin/projects"
          label="Projects"
          count={projects?.length ?? '—'}
          icon={FolderKanban}
          hint="Showcase items"
        />
        <StatCard
          to="/admin/experience"
          label="Experience"
          count={experience?.length ?? '—'}
          icon={Briefcase}
          hint="Roles & history"
        />
        <StatCard
          to="/admin/testimonials"
          label="Testimonials"
          count={testimonials?.length ?? '—'}
          icon={MessageSquareQuote}
          hint="Recommendations"
        />
        <StatCard
          to="/admin/now"
          label="Now"
          count={now?.items.length ?? '—'}
          icon={Sparkles}
          hint={now?.updated ? `Updated ${now.updated}` : undefined}
        />
        <StatCard
          to="/admin/cv"
          label="CV"
          count={cv ? '1 doc' : '—'}
          icon={FileText}
          hint="Single editable document"
        />
        <StatCard
          to="/admin/messages"
          label="Messages"
          count={msgCount ?? '—'}
          icon={Inbox}
          hint={msgUnread > 0 ? `${msgUnread} unread` : 'Contact form inbox'}
        />
        <StatCard
          to="/admin/blog"
          label="Blog Posts"
          count={postCount ?? '—'}
          icon={BookOpen}
          hint={postPublished > 0 ? `${postPublished} published` : 'SEO content'}
        />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-zinc-300 mb-3">Quick tips</h2>
        <ul className="text-sm text-zinc-500 space-y-2 list-disc list-inside">
          <li>Edits invalidate the public cache and appear on the next page mount.</li>
          <li>Project images use Firebase Storage — uploads are scoped to <code className="text-zinc-400">projects/</code>.</li>
          <li>Reordering uses arrow buttons; the new order is persisted as a single batch write.</li>
        </ul>
      </section>
    </div>
  );
}
