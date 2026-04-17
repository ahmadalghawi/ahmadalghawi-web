import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Box, ExternalLink, Code2 as Github } from 'lucide-react';

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
}

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

interface CachedData {
  user: GitHubUser;
  repos: Repo[];
  fetchedAt: number;
}

const USERNAME = 'ahmadalghawi';
const CACHE_KEY = `gh-stats:${USERNAME}`;
const TTL_MS = 1000 * 60 * 60; // 1 hour

const LANG_COLORS: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-400',
  HTML:       'bg-orange-400',
  CSS:        'bg-pink-400',
  Python:     'bg-green-400',
  Dart:       'bg-cyan-400',
  Vue:        'bg-emerald-400',
  PHP:        'bg-indigo-400',
  default:    'bg-gray-400',
};

function readCache(): CachedData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachedData = JSON.parse(raw);
    if (Date.now() - data.fetchedAt > TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: Omit<CachedData, 'fetchedAt'>) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, fetchedAt: Date.now() }));
  } catch {
    /* ignore */
  }
}

export default function GitHubStats() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setUser(cached.user);
      setRepos(cached.repos);
      setStatus('ok');
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`, { signal: controller.signal }),
          fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { signal: controller.signal }),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
        const u: GitHubUser = await userRes.json();
        const r: Repo[] = await reposRes.json();
        setUser(u);
        setRepos(r);
        setStatus('ok');
        writeCache({ user: u, repos: r });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setStatus('error');
      }
    })();

    return () => controller.abort();
  }, []);

  if (status === 'loading') {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Github className="text-gray-400" size={20} />
          <span className="text-white text-lg font-bold">github.json</span>
          <span className="text-gray-500 text-xs font-mono">fetching...</span>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  if (status === 'error' || !user) {
    // Graceful fallback — hide silently if the widget can't load
    return null;
  }

  // Compute top languages
  const langCounts: Record<string, number> = {};
  repos.forEach(r => { if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1; });
  const totalLang = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
  const topLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, pct: Math.round((count / totalLang) * 100) }));

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Github className="text-white" size={20} />
        <span className="text-white text-lg font-bold">github.json</span>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1 ml-auto">
          @{USERNAME} <ExternalLink size={11} />
        </a>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat icon={Box}   label="repos"     value={user.public_repos} />
        <Stat icon={Users} label="followers" value={user.followers} />
        <Stat icon={Star}  label="starred"   value={repos.reduce((s, r) => s + r.stargazers_count, 0)} />
      </div>

      {/* Top languages */}
      {topLangs.length > 0 && (
        <div className="mb-5">
          <div className="text-gray-500 text-xs font-mono mb-2">{'// top languages'}</div>
          <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-900">
            {topLangs.map(l => (
              <motion.div
                key={l.name}
                initial={{ width: 0 }}
                animate={{ width: `${l.pct}%` }}
                transition={{ duration: 0.6 }}
                className={`${LANG_COLORS[l.name] ?? LANG_COLORS.default}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-mono">
            {topLangs.map(l => (
              <div key={l.name} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${LANG_COLORS[l.name] ?? LANG_COLORS.default}`} />
                <span className="text-gray-300">{l.name}</span>
                <span className="text-gray-500">{l.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top repos */}
      {topRepos.length > 0 && (
        <div>
          <div className="text-gray-500 text-xs font-mono mb-2">{'// most-starred repos'}</div>
          <div className="space-y-2">
            {topRepos.map(r => (
              <a
                key={r.id}
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-900 border border-gray-700 hover:border-cyan-400 transition-colors rounded p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-cyan-400 font-mono text-sm font-semibold truncate">{r.name}</span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs shrink-0">
                    <Star size={11} /> {r.stargazers_count}
                  </span>
                </div>
                {r.description && <div className="text-gray-400 text-xs mt-1 line-clamp-2">{r.description}</div>}
                {r.language && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-2 h-2 rounded-full ${LANG_COLORS[r.language] ?? LANG_COLORS.default}`} />
                    <span className="text-gray-500 text-xs font-mono">{r.language}</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-3 text-center">
      <Icon className="text-cyan-400 mx-auto mb-1" size={16} />
      <div className="text-white font-bold text-xl">{value}</div>
      <div className="text-gray-500 text-xs font-mono">{label}</div>
    </div>
  );
}
