import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, GitFork, Eye, Users, UserPlus, Book, Calendar, MapPin, Building2,
  Link as LinkIcon, Mail, ExternalLink, Archive, GitCommit,
  Code2, Activity as ActivityIcon, Tag, AlertCircle, GitPullRequest,
  GitBranch, Package as PackageIcon, Plus, Rocket, Circle,
} from 'lucide-react';
import { useGitHubData, type GHEvent, type GHRepo } from '../hooks/useGitHubData';

/* ═══════════════════════════════════════════════════════════════
   GitHub Profile — rich Source Control dashboard
   ═══════════════════════════════════════════════════════════════ */

const USERNAME = 'ahmadalghawi';

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  SCSS:       '#c6538c',
  Python:     '#3572A5',
  Dart:       '#00B4AB',
  Vue:        '#41b883',
  PHP:        '#4F5D95',
  Java:       '#b07219',
  Kotlin:     '#A97BFF',
  Swift:      '#F05138',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  C:          '#555555',
  'C++':      '#f34b7d',
  'C#':       '#178600',
  Ruby:       '#701516',
  Shell:      '#89e051',
  Dockerfile: '#384d54',
  default:    '#8b949e',
};

const langColor = (name: string | null | undefined) =>
  (name && LANG_COLORS[name]) || LANG_COLORS.default;

export default function GitHubProfile() {
  const { user, repos, events, status, error } = useGitHubData(USERNAME);

  if (status === 'loading') return <ProfileSkeleton />;

  if (status === 'error' || !user) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/50 flex items-start gap-3">
        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
        <div className="text-sm">
          <div className="text-red-300 font-semibold mb-1">Couldn't reach GitHub</div>
          <div className="text-gray-400 font-mono text-xs">{error || 'API rate-limit or network issue. Try again in a minute.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />
      <StatsGrid user={user} repos={repos} />
      <LanguageBreakdown repos={repos} />
      <ActivityFeed events={events} />
      <RepositoryList repos={repos} />
    </div>
  );
}

/* ─────────────────────────── Profile header ─────────────────────────── */

function ProfileHeader({ user }: { user: import('../hooks/useGitHubData').GHUser }) {
  const joined = new Date(user.created_at);
  const joinedLabel = joined.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

  const blog = user.blog && (user.blog.startsWith('http') ? user.blog : `https://${user.blog}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
    >
      <div className="h-20 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
      <div className="px-6 pb-5 -mt-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-900 shrink-0"
          />
          <div className="flex-1 min-w-0 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white text-xl font-bold">{user.name || user.login}</span>
              <span className="text-gray-400 font-mono">@{user.login}</span>
              {user.hireable && (
                <span className="bg-green-500/15 border border-green-500/40 text-green-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  available for hire
                </span>
              )}
            </div>
            {user.bio && (
              <p className="text-gray-300 text-sm mt-1.5 leading-relaxed">{user.bio}</p>
            )}
          </div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-end shrink-0 bg-gray-900 hover:bg-gray-700 border border-gray-700 hover:border-cyan-400 transition-colors text-cyan-400 text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5"
          >
            View on GitHub <ExternalLink size={11} />
          </a>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs font-mono text-gray-400">
          {user.company && <span className="flex items-center gap-1.5"><Building2 size={12} /> {user.company}</span>}
          {user.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {user.location}</span>}
          {blog && (
            <a href={blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <LinkIcon size={12} /> {user.blog}
            </a>
          )}
          {user.email && (
            <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <Mail size={12} /> {user.email}
            </a>
          )}
          {user.twitter_username && (
            <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              @{user.twitter_username}
            </a>
          )}
          <span className="flex items-center gap-1.5"><Calendar size={12} /> Joined {joinedLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── Stats grid ─────────────────────────── */

function StatsGrid({
  user,
  repos,
}: {
  user: import('../hooks/useGitHubData').GHUser;
  repos: GHRepo[];
}) {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const totalWatchers = repos.reduce((s, r) => s + r.watchers_count, 0);
  const ownRepos = repos.filter(r => !r.fork).length;

  const cards = [
    { icon: Book,      label: 'repos',      value: user.public_repos, color: 'text-cyan-400',   sub: `${ownRepos} original` },
    { icon: Star,      label: 'stars',      value: totalStars,        color: 'text-yellow-400', sub: 'earned' },
    { icon: GitFork,   label: 'forks',      value: totalForks,        color: 'text-purple-400', sub: 'across repos' },
    { icon: Eye,       label: 'watchers',   value: totalWatchers,     color: 'text-blue-400',   sub: 'total' },
    { icon: Users,     label: 'followers',  value: user.followers,    color: 'text-green-400',  sub: 'on GitHub' },
    { icon: UserPlus,  label: 'following',  value: user.following,    color: 'text-pink-400',   sub: 'devs' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
          >
            <Icon className={`${c.color} mb-2`} size={18} />
            <div className="text-white text-2xl font-bold leading-none">{c.value.toLocaleString()}</div>
            <div className="text-gray-400 text-xs font-mono mt-1">{c.label}</div>
            <div className="text-gray-500 text-[10px] font-mono mt-0.5">{c.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Language breakdown ─────────────────────────── */

function LanguageBreakdown({ repos }: { repos: GHRepo[] }) {
  const { langs, total } = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach(r => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    const t = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: (count / t) * 100 }));
    return { langs: sorted, total: t };
  }, [repos]);

  if (langs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <Code2 className="text-cyan-400" size={20} />
        <span className="text-white text-lg font-bold">languages.json</span>
        <span className="text-gray-500 text-xs font-mono ml-auto">
          {langs.length} langs · {total} {total === 1 ? 'repo' : 'repos'}
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-900 mb-4">
        {langs.map(l => (
          <motion.div
            key={l.name}
            initial={{ width: 0 }}
            animate={{ width: `${l.pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ backgroundColor: langColor(l.name) }}
            title={`${l.name} — ${l.pct.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-xs font-mono">
        {langs.map(l => (
          <div key={l.name} className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: langColor(l.name) }} />
            <span className="text-gray-300 truncate">{l.name}</span>
            <span className="text-gray-500 ml-auto shrink-0">{l.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── Activity feed ─────────────────────────── */

function ActivityFeed({ events }: { events: GHEvent[] }) {
  if (events.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <ActivityIcon className="text-green-400" size={20} />
        <span className="text-white text-lg font-bold">recent activity</span>
        <span className="text-gray-500 text-xs font-mono ml-auto">last {Math.min(events.length, 15)} events</span>
      </div>

      <div className="space-y-2">
        {events.slice(0, 15).map((ev, i) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <ActivityRow event={ev} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ActivityRow({ event }: { event: GHEvent }) {
  const meta = describeEvent(event);
  const Icon = meta.icon;
  const when = relativeTime(event.created_at);
  const repoUrl = `https://github.com/${event.repo.name}`;

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-900 rounded border border-gray-700 hover:border-gray-600 transition-colors">
      <Icon className={`${meta.color} shrink-0 mt-0.5`} size={14} />
      <div className="flex-1 min-w-0 font-mono text-xs">
        <div className="text-gray-300">
          {meta.text}{' '}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {event.repo.name}
          </a>
        </div>
        {meta.detail && <div className="text-gray-500 mt-1 truncate">{meta.detail}</div>}
      </div>
      <span className="text-gray-500 text-[10px] font-mono shrink-0">{when}</span>
    </div>
  );
}

interface EventMeta {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  text: string;
  detail?: string;
}

function describeEvent(ev: GHEvent): EventMeta {
  const p = ev.payload;
  switch (ev.type) {
    case 'PushEvent': {
      const commits = (p.commits as Array<{ message: string }>) || [];
      const count = (p.size as number) || commits.length || 1;
      const first = commits[0]?.message?.split('\n')[0];
      return {
        icon: GitCommit,
        color: 'text-green-400',
        text: `Pushed ${count} commit${count === 1 ? '' : 's'} to`,
        detail: first,
      };
    }
    case 'CreateEvent': {
      const refType = p.ref_type as string;
      const ref = p.ref as string | null;
      return {
        icon: Plus,
        color: 'text-cyan-400',
        text: refType === 'repository'
          ? 'Created repository'
          : `Created ${refType}${ref ? ` ${ref}` : ''} in`,
      };
    }
    case 'WatchEvent':
      return { icon: Star, color: 'text-yellow-400', text: 'Starred' };
    case 'ForkEvent':
      return { icon: GitFork, color: 'text-purple-400', text: 'Forked' };
    case 'PullRequestEvent': {
      const action = p.action as string;
      const pr = p.pull_request as { title: string; number: number } | undefined;
      return {
        icon: GitPullRequest,
        color: 'text-blue-400',
        text: `${cap(action)} pull request in`,
        detail: pr ? `#${pr.number} ${pr.title}` : undefined,
      };
    }
    case 'IssuesEvent': {
      const action = p.action as string;
      const issue = p.issue as { title: string; number: number } | undefined;
      return {
        icon: AlertCircle,
        color: 'text-orange-400',
        text: `${cap(action)} issue in`,
        detail: issue ? `#${issue.number} ${issue.title}` : undefined,
      };
    }
    case 'IssueCommentEvent': {
      const issue = p.issue as { title: string; number: number } | undefined;
      return {
        icon: AlertCircle,
        color: 'text-orange-300',
        text: 'Commented on issue in',
        detail: issue ? `#${issue.number} ${issue.title}` : undefined,
      };
    }
    case 'ReleaseEvent': {
      const release = p.release as { tag_name: string; name: string } | undefined;
      return {
        icon: Rocket,
        color: 'text-pink-400',
        text: 'Released',
        detail: release ? `${release.tag_name}${release.name ? ` — ${release.name}` : ''}` : undefined,
      };
    }
    case 'PublicEvent':
      return { icon: Eye, color: 'text-green-400', text: 'Made public' };
    case 'DeleteEvent': {
      const refType = p.ref_type as string;
      const ref = p.ref as string;
      return { icon: Archive, color: 'text-red-400', text: `Deleted ${refType} ${ref} in` };
    }
    default:
      return { icon: Circle, color: 'text-gray-500', text: `${ev.type.replace('Event', '')} in` };
  }
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const s = Math.max(0, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

/* ─────────────────────────── Repository list ─────────────────────────── */

type SortKey = 'updated' | 'stars' | 'forks' | 'created';
type FilterKey = 'all' | 'sources' | 'forks' | 'archived';

function RepositoryList({ repos }: { repos: GHRepo[] }) {
  const [sort, setSort] = useState<SortKey>('updated');
  const [filter, setFilter] = useState<FilterKey>('sources');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(6);

  const filtered = useMemo(() => {
    let list = repos;
    if (filter === 'sources') list = list.filter(r => !r.fork && !r.archived);
    else if (filter === 'forks') list = list.filter(r => r.fork);
    else if (filter === 'archived') list = list.filter(r => r.archived);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        r.topics.some(t => t.includes(q))
      );
    }

    const sorter: Record<SortKey, (a: GHRepo, b: GHRepo) => number> = {
      updated: (a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at),
      stars:   (a, b) => b.stargazers_count - a.stargazers_count,
      forks:   (a, b) => b.forks_count - a.forks_count,
      created: (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    };
    return [...list].sort(sorter[sort]);
  }, [repos, sort, filter, query]);

  const shown = filtered.slice(0, visible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6"
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <PackageIcon className="text-purple-400" size={20} />
        <span className="text-white text-lg font-bold">repositories</span>
        <span className="text-gray-500 text-xs font-mono">({filtered.length})</span>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Find a repo..."
            aria-label="Search repositories"
            className="bg-gray-900 border border-gray-700 focus:border-cyan-400 transition-colors rounded px-2 py-1 text-xs font-mono text-white placeholder-gray-500 outline-none w-36"
          />
          <SegmentedControl<FilterKey>
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'sources',  label: 'Sources' },
              { value: 'all',      label: 'All' },
              { value: 'forks',    label: 'Forks' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
          <SegmentedControl<SortKey>
            value={sort}
            onChange={setSort}
            options={[
              { value: 'updated', label: 'Updated' },
              { value: 'stars',   label: 'Stars' },
              { value: 'forks',   label: 'Forks' },
              { value: 'created', label: 'New' },
            ]}
          />
        </div>
      </div>

      {shown.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm font-mono">no repositories match</div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {shown.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <RepoCard repo={r} />
          </motion.div>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisible(v => v + 6)}
            className="bg-gray-900 hover:bg-gray-700 border border-gray-700 hover:border-cyan-400 transition-colors text-cyan-400 text-xs font-mono px-4 py-2 rounded cursor-pointer"
          >
            Show {Math.min(6, filtered.length - visible)} more
          </button>
        </div>
      )}
    </motion.div>
  );
}

function RepoCard({ repo }: { repo: GHRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-900 border border-gray-700 hover:border-cyan-400 transition-colors rounded-lg p-4 h-full"
    >
      <div className="flex items-start gap-2 mb-1.5">
        {repo.fork ? <GitFork className="text-gray-500 shrink-0 mt-0.5" size={14} /> : <Book className="text-cyan-400 shrink-0 mt-0.5" size={14} />}
        <span className="text-cyan-400 font-mono text-sm font-semibold truncate flex-1">{repo.name}</span>
        {repo.archived && (
          <span className="bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0">
            archived
          </span>
        )}
        {repo.fork && (
          <span className="bg-gray-700 text-gray-300 text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0">
            fork
          </span>
        )}
      </div>

      {repo.description && (
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-2.5">{repo.description}</p>
      )}

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {repo.topics.slice(0, 4).map(t => (
            <span
              key={t}
              className="bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-full px-2 py-0.5 text-[10px] font-mono flex items-center gap-1"
            >
              <Tag size={9} /> {t}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="text-gray-500 text-[10px] font-mono self-center">+{repo.topics.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor(repo.language) }} />
            <span className="text-gray-400">{repo.language}</span>
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1"><Star size={10} /> {repo.stargazers_count}</span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1"><GitFork size={10} /> {repo.forks_count}</span>
        )}
        {repo.open_issues_count > 0 && (
          <span className="flex items-center gap-1"><AlertCircle size={10} /> {repo.open_issues_count}</span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <GitBranch size={10} /> {repo.default_branch}
        </span>
        <span>· updated {relativeTime(repo.pushed_at)}</span>
      </div>
    </a>
  );
}

/* ─────────────────────────── Segmented control ─────────────────────────── */

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="inline-flex bg-gray-900 border border-gray-700 rounded overflow-hidden text-[10px] font-mono">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2 py-1 transition-colors cursor-pointer border-none ${
            value === opt.value
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────── Skeleton ─────────────────────────── */

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="h-20 bg-gray-700" />
        <div className="px-6 pb-5 -mt-10">
          <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-gray-800" />
          <div className="h-4 w-48 bg-gray-700 rounded mt-3" />
          <div className="h-3 w-64 bg-gray-700 rounded mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-20" />
        ))}
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-40" />
    </div>
  );
}
