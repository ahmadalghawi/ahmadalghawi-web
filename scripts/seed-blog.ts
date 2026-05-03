/**
 * One-shot Firestore seed script for blog posts.
 *
 * Writes a small set of example markdown posts into the `posts` collection so
 * the public /blog page, prerender script, sitemap and RSS feed all have
 * realistic content to render.
 *
 * Usage (PowerShell):
 *   npm run seed:blog
 *
 * Idempotent: re-running overwrites by id (merge:true). publishedAt is only
 * set on the very first publish — subsequent runs preserve it.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const envKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
] as const;
type EnvKey = (typeof envKeys)[number];
const env: Record<EnvKey, string> = {} as Record<EnvKey, string>;
for (const k of envKeys) {
  const v = process.env[k];
  if (!v) { console.error(`[seed:blog] Missing env var: ${k}`); process.exit(1); }
  env[k] = v;
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);
const auth = getAuth(app);

interface SeedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  featured: boolean;
}

function estimateReadingTime(md: string): number {
  const words = md.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const POSTS: SeedPost[] = [
  {
    id: 'building-firestore-blog',
    slug: 'building-a-firestore-backed-blog',
    title: 'Building a Firestore-backed Markdown Blog',
    excerpt:
      'How I added a fully admin-driven blog to my React 19 portfolio using Firestore, react-markdown, and a custom prerender pipeline — no headless CMS required.',
    content: `## Why Firestore?

I already had Firestore powering projects, experience and the contact form on my portfolio.
Adding a blog was a natural fit: one auth model, one set of security rules, one bill.

## The data shape

A post is just a document in the \`posts\` collection:

\`\`\`ts
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;     // raw markdown
  tags: string[];
  published: boolean;
  featured: boolean;
  publishedAt?: string;
  updatedAt?: string;
}
\`\`\`

## Security rules

The single most important rule:

\`\`\`
match /posts/{id} {
  allow read: if resource.data.published == true || isAdmin();
  allow write: if isAdmin();
}
\`\`\`

This keeps drafts private without needing a separate collection.

## Rendering

Public reads use \`react-markdown\` with \`remark-gfm\`, \`rehype-slug\` and
\`rehype-autolink-headings\` so every \`<h2>\` and \`<h3>\` gets a stable id —
which the table-of-contents component then observes with \`IntersectionObserver\`.

## SEO

A small \`scripts/prerender.ts\` runs after \`vite build\` and emits one static
HTML file per published post, with title, description, canonical, Open Graph
and a \`BlogPosting\` JSON-LD block injected into \`<head>\`. Crawlers see
fully-rendered HTML; users still get the SPA experience.

## Takeaway

You don't need Contentful, Sanity or Notion-as-CMS to ship a blog. If you
already have Firestore in your stack, a few hundred lines of code gets you
all the way there.
`,
    tags: ['firebase', 'react', 'blog', 'seo'],
    published: true,
    featured: true,
  },
  {
    id: 'react-19-native-head',
    slug: 'react-19-native-head-management',
    title: 'Goodbye react-helmet, hello React 19',
    excerpt:
      'React 19 hoists <title>, <meta> and <link> tags into <head> automatically. Here is what changed in my portfolio when I dropped react-helmet-async.',
    content: `## The old way

For years the answer to *"how do I set the page title in a SPA?"* was
\`react-helmet\` (or its async-safe sibling \`react-helmet-async\`).
You wrapped your app in a \`<HelmetProvider>\` and rendered a \`<Helmet>\`
element somewhere deep in your tree.

## What React 19 changed

React 19 treats certain elements specially. If you render this anywhere in
your component tree:

\`\`\`tsx
<title>{post.title} — My Site</title>
<meta name="description" content={post.excerpt} />
<link rel="canonical" href={canonical} />
\`\`\`

…React hoists them straight into the document \`<head>\`, deduplicates by
attribute, and even handles the \`async\` and \`defer\` flags on \`<script>\`.

## Migration

For my portfolio it was a straight find-and-replace:

1. Remove \`<HelmetProvider>\` from \`main.tsx\`.
2. Replace every \`<Helmet>...</Helmet>\` with the bare children.
3. \`npm uninstall react-helmet-async\`.

That's it. Same SEO output, one less dependency, no provider, no context.

## Caveats

- Server-rendering still needs a flush mechanism (React's official RSC story handles this).
- For prerendered static pages, my custom \`scripts/prerender.ts\` injects
  the meta tags into the HTML shell directly so crawlers don't need JS at all.
`,
    tags: ['react', 'react-19', 'seo'],
    published: true,
    featured: false,
  },
  {
    id: 'firestore-orderby-pitfall',
    slug: 'the-firestore-orderby-composite-index-pitfall',
    title: 'The Firestore orderBy + where Composite Index Pitfall',
    excerpt:
      'A "simple" published-posts query exploded in production with a missing-index error. Here is why, and the two-line fix that made it go away.',
    content: `## The query that broke production

\`\`\`ts
const q = query(
  collection(db, 'posts'),
  where('published', '==', true),
  orderBy('publishedAt', 'desc'),
);
\`\`\`

Looks innocent. It works in the emulator. It works locally with one or two
documents. Then you deploy and your users see a console full of:

> The query requires an index. You can create it here: …

## Why?

Firestore needs a **composite index** for any query that combines a
\`where\` filter with an \`orderBy\` on a different field. Single-field
indexes are automatic; composite ones are not.

## Two ways to fix it

**Option A — create the index.** Click the link in the error, wait a few
minutes, done. This is the right answer for large collections.

**Option B — sort client-side.** For small datasets (a personal blog, a CV
page, a portfolio with twenty entries) this is simpler:

\`\`\`ts
export async function getPublishedPosts(): Promise<Post[]> {
  const q = query(collection(db, 'posts'), where('published', '==', true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => serializeDoc<Post>(d.id, d.data()))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}
\`\`\`

No index management, no migration, no surprise billing.

## Rule of thumb

If your collection will never grow past a few hundred documents and you
already have to download all of them to render the page, sort in JS. Save
composite indexes for the queries that genuinely need them.
`,
    tags: ['firebase', 'firestore', 'performance'],
    published: true,
    featured: false,
  },
];

async function main() {
  console.log('[seed:blog] Signing in as admin…');
  const cred = await signInWithEmailAndPassword(auth, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
  console.log(`[seed:blog] Signed in as ${cred.user.email} (uid=${cred.user.uid})`);
  console.log(`[seed:blog] Writing ${POSTS.length} posts…`);

  for (const p of POSTS) {
    const ref = doc(db, 'posts', p.id);
    const existing = await getDoc(ref);
    const alreadyHasPublishedAt = !!existing.data()?.publishedAt;

    const payload: Record<string, unknown> = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags,
      published: p.published,
      featured: p.featured,
      readingTime: estimateReadingTime(p.content),
      ...(p.coverImage ? { coverImage: p.coverImage } : {}),
      updatedAt: serverTimestamp(),
    };
    if (!existing.exists()) payload.createdAt = serverTimestamp();
    if (p.published && !alreadyHasPublishedAt) payload.publishedAt = serverTimestamp();

    await setDoc(ref, payload, { merge: true });
    console.log(`  ✔ ${p.slug}`);
  }

  console.log('\n[seed:blog] ✔ Blog posts seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed:blog] Failed:', err);
  process.exit(1);
});
