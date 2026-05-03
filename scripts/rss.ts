/**
 * Build-time script: generates rss.xml in the dist folder.
 *
 * Reads prerender-routes.json and fetches published posts from Firestore to
 * produce a valid RSS 2.0 feed.
 *
 * Usage:
 *   tsx scripts/rss.ts
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';

function env(k: string): string {
  const v = process.env[k];
  if (!v) {
    console.error(`[rss] Missing env var: ${k}`);
    process.exit(1);
  }
  return v;
}

const firebaseConfig = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
};

const app = initializeApp(firebaseConfig, 'rss-build');
const db = getFirestore(app);

const BASE = 'https://ahmadalghawi.dev';

interface RssPost { title: string; slug: string; excerpt: string; publishedAt?: string; }

async function main() {
  let posts: RssPost[] = [];
  try {
    console.log('[rss] Fetching published posts…');
    const q = query(collection(db, 'posts'), where('published', '==', true));
    const snap = await getDocs(q);
    posts = snap.docs
      .sort((a, b) => (b.data().publishedAt?.toMillis?.() || 0) - (a.data().publishedAt?.toMillis?.() || 0))
      .map((d) => {
        const data = d.data();
        const pa = data.publishedAt;
        const publishedAt = pa?.toDate ? (pa.toDate() as Date).toISOString()
          : typeof pa === 'string' ? pa : undefined;
        return {
          title: String(data.title),
          slug: String(data.slug),
          excerpt: String(data.excerpt),
          publishedAt,
        };
      });
  } catch (e) {
    console.warn('[rss] Firestore fetch failed, writing empty feed:', (e as Error).message);
  }

  const buildDate = new Date().toUTCString();

  const items = posts.map((p) => {
    const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : buildDate;
    return `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${BASE}/blog/${p.slug}</link>
    <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
    <description>${escapeXml(p.excerpt)}</description>
    <pubDate>${pubDate}</pubDate>
  </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ahmad Alghawi — Blog</title>
    <link>${BASE}/blog</link>
    <description>Articles about web development, React, Firebase, and building performant portfolios.</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

  writeFileSync('./dist/rss.xml', xml);
  console.log(`[rss] ✔ ${posts.length} items written to dist/rss.xml`);
  process.exit(0);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

main().catch((err) => {
  console.error('[rss] Failed:', err);
  process.exit(1);
});
