/**
 * Build-time script: fetches published blog posts from Firestore and writes
 * a prerender routes JSON so vite-plugin-prerender knows which /blog/{slug}
 * pages to generate.
 *
 * Usage:
 *   tsx scripts/generate-routes.ts
 *
 * Outputs:
 *   prerender-routes.json  → { static: string[], dynamic: string[] }
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';

function env(k: string): string {
  const v = process.env[k];
  if (!v) {
    console.error(`[generate-routes] Missing env var: ${k}`);
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

const app = initializeApp(firebaseConfig, 'build-script');
const db = getFirestore(app);

const STATIC_ROUTES = [
  '/',
  '/experience',
  '/skills',
  '/projects',
  '/blog',
  '/contact',
  '/cv',
];

async function main() {
  console.log('[generate-routes] Fetching published posts & projects…');
  const dynamic: string[] = [];

  // Blog posts (published only)
  try {
    const q = query(collection(db, 'posts'), where('published', '==', true));
    const snap = await getDocs(q);
    const blog = snap.docs
      .sort((a, b) => (b.data().publishedAt?.toMillis?.() || 0) - (a.data().publishedAt?.toMillis?.() || 0))
      .map((d) => `/blog/${d.data().slug as string}`)
      .filter(Boolean);
    dynamic.push(...blog);
    console.log(`[generate-routes] ✔ ${blog.length} blog routes`);
  } catch (e) {
    console.warn('[generate-routes] Blog fetch failed:', (e as Error).message);
  }

  // Project case-study pages (all — /projects/:id uses doc IDs)
  try {
    const snap = await getDocs(collection(db, 'projects'));
    const projects = snap.docs.map((d) => `/projects/${d.id}`).filter(Boolean);
    dynamic.push(...projects);
    console.log(`[generate-routes] ✔ ${projects.length} project routes`);
  } catch (e) {
    console.warn('[generate-routes] Projects fetch failed:', (e as Error).message);
  }

  const payload = { static: STATIC_ROUTES, dynamic };
  const outPath = './prerender-routes.json';
  writeFileSync(outPath, JSON.stringify(payload, null, 2));

  console.log(`[generate-routes] ✔ ${dynamic.length} dynamic + ${STATIC_ROUTES.length} static routes written to ${outPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('[generate-routes] Failed:', err);
  process.exit(1);
});
