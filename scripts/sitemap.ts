/**
 * Build-time script: generates sitemap.xml in the dist folder.
 *
 * Usage:
 *   tsx scripts/sitemap.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const BASE = 'https://ahmadalghawi.dev';

function env(k: string): string {
  const v = process.env[k];
  if (!v) { console.error(`[sitemap] Missing ${k}`); process.exit(1); }
  return v;
}

const app = initializeApp({
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
}, 'sitemap');
const db = getFirestore(app);

interface RoutePayload { static: string[]; dynamic: string[]; }

async function main() {
  let payload: RoutePayload;
  const routesPath = './prerender-routes.json';

  if (existsSync(routesPath)) {
    payload = JSON.parse(readFileSync(routesPath, 'utf-8'));
  } else {
    let dynamic: string[] = [];
    try {
      const q = query(collection(db, 'posts'), where('published', '==', true));
      const snap = await getDocs(q);
      dynamic = snap.docs
        .sort((a, b) => (b.data().publishedAt?.toMillis?.() || 0) - (a.data().publishedAt?.toMillis?.() || 0))
        .map((d) => `/blog/${d.data().slug as string}`);
    } catch (e) {
      console.warn('[sitemap] Firestore fetch failed:', (e as Error).message);
    }
    payload = { static: ['/', '/experience', '/skills', '/projects', '/blog', '/contact', '/cv'], dynamic };
  }

  const allRoutes = [...payload.static, ...payload.dynamic];
  const today = new Date().toISOString().split('T')[0];

  const entries = allRoutes.map((path) => {
    const url = `${BASE}${path}`;
    const priority = path === '/' ? '1.0' : path === '/blog' ? '0.9' : path.startsWith('/blog/') ? '0.8' : '0.7';
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  writeFileSync('./dist/sitemap.xml', xml);
  console.log(`[sitemap] ✔ ${allRoutes.length} URLs written to dist/sitemap.xml`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
