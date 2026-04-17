import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════
   GitHub public-API fetcher with sessionStorage caching.
   One hook returns user profile, repos, and activity events.
   No auth required — 60 req/hour per IP, cached 1h to stay safe.
   ═══════════════════════════════════════════════════════════════ */

export interface GHUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  email: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  hireable: boolean | null;
}

export interface GHRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  size: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  license: { name: string; spdx_id: string } | null;
}

export interface GHEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string; url: string };
  payload: Record<string, unknown>;
}

interface Cache {
  user: GHUser;
  repos: GHRepo[];
  events: GHEvent[];
  fetchedAt: number;
}

const TTL_MS = 1000 * 60 * 60; // 1 hour

export type FetchStatus = 'loading' | 'ok' | 'error';

interface UseGitHubDataResult {
  user: GHUser | null;
  repos: GHRepo[];
  events: GHEvent[];
  status: FetchStatus;
  error: string | null;
}

export function useGitHubData(username: string): UseGitHubDataResult {
  const [user, setUser] = useState<GHUser | null>(null);
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [events, setEvents] = useState<GHEvent[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = `gh-data:${username}`;

    // Try cache first
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const cached: Cache = JSON.parse(raw);
        if (Date.now() - cached.fetchedAt < TTL_MS) {
          setUser(cached.user);
          setRepos(cached.repos);
          setEvents(cached.events);
          setStatus('ok');
          return;
        }
      }
    } catch {
      /* ignore cache parse errors */
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const [userRes, reposRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { signal }),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { signal }),
          fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { signal }),
        ]);

        if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
        if (!reposRes.ok) throw new Error(`Repos fetch failed: ${reposRes.status}`);
        // events may 403 if rate-limited; treat as soft failure
        const u: GHUser = await userRes.json();
        const r: GHRepo[] = await reposRes.json();
        const e: GHEvent[] = eventsRes.ok ? await eventsRes.json() : [];

        setUser(u);
        setRepos(r);
        setEvents(e);
        setStatus('ok');

        try {
          const payload: Cache = { user: u, repos: r, events: e, fetchedAt: Date.now() };
          sessionStorage.setItem(key, JSON.stringify(payload));
        } catch {
          /* storage full — ignore */
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError((err as Error).message);
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [username]);

  return { user, repos, events, status, error };
}
