import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function env(k: string): string {
  const v = process.env[k];
  if (!v) { console.error(`[prerender] Missing ${k}`); process.exit(1); }
  return v;
}

const app = initializeApp({
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
}, 'prerender');
const db = getFirestore(app);
const BASE = 'https://ahmadalghawi.dev';

const STATIC = [
  { p:'/', t:'Ahmad Alghawi — Full Stack & AI Engineer', d:'Portfolio of Ahmad Alghawi, a Senior Full Stack & AI Engineer building scalable web and mobile apps.' },
  { p:'/experience', t:'Experience — Ahmad Alghawi', d:'Work experience and professional history.' },
  { p:'/skills', t:'Skills — Ahmad Alghawi', d:'Technical skills and proficiencies.' },
  { p:'/projects', t:'Projects — Ahmad Alghawi', d:'Portfolio of web and mobile projects.' },
  { p:'/blog', t:'Blog — Ahmad Alghawi', d:'Articles about web development, React, Firebase, and SEO.' },
  { p:'/contact', t:'Contact — Ahmad Alghawi', d:'Get in touch for opportunities and collaborations.' },
  { p:'/cv', t:'CV — Ahmad Alghawi', d:'Full resume and curriculum vitae.' },
];

function metaBlock(opts: {title:string;desc:string;canonical:string;ogImage?:string;ogType?:string;jsonLd?:string}) {
  const lines = [
    `<title>${esc(opts.title)}</title>`,
    `<meta name="description" content="${esc(opts.desc)}">`,
    `<link rel="canonical" href="${esc(opts.canonical)}">`,
    `<meta property="og:title" content="${esc(opts.title)}">`,
    `<meta property="og:description" content="${esc(opts.desc)}">`,
    `<meta property="og:type" content="${opts.ogType || 'website'}">`,
    `<meta property="og:url" content="${esc(opts.canonical)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ];
  if (opts.ogImage) lines.push(`<meta property="og:image" content="${esc(opts.ogImage)}">`);
  if (opts.jsonLd) lines.push(`<script type="application/ld+json">${opts.jsonLd}</script>`);
  return lines.join('\n');
}

function injectMeta(shell: string, block: string) {
  const idx = shell.indexOf('</head>');
  if (idx === -1) throw new Error('Missing </head> in index.html');
  let body = shell.slice(0, idx);
  // Strip existing conflicting SEO tags so we don't produce duplicates
  body = body.replace(/<title>.*?<\/title>/gi, '');
  body = body.replace(/<meta\s+name=["']?description["']?[^>]*>/gi, '');
  body = body.replace(/<link\s+rel=["']?canonical["']?[^>]*>/gi, '');
  body = body.replace(/<meta\s+property=["']?og:[^"']+["']?[^>]*>/gi, '');
  body = body.replace(/<meta\s+name=["']?twitter:[^"']+["']?[^>]*>/gi, '');
  return body + block + '\n' + shell.slice(idx);
}

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function ensureDir(fp: string) { mkdirSync(dirname(fp), { recursive: true }); }

async function main() {
  const shell = readFileSync('./dist/index.html', 'utf-8');

  function toIso(v: unknown): string | undefined {
    if (!v) return undefined;
    if (typeof v === 'object' && 'toDate' in (v as object)) return (v as { toDate: () => Date }).toDate().toISOString();
    if (typeof v === 'string') return v;
    return undefined;
  }

  let posts: { slug: string; title: string; excerpt: string; coverImage?: string; publishedAt?: string; updatedAt?: string }[] = [];
  try {
    const q = query(collection(db,'posts'), where('published','==',true));
    const snap = await getDocs(q);
    posts = snap.docs.map(d => {
      const data = d.data();
      return {
        slug: String(data.slug),
        title: String(data.title),
        excerpt: String(data.excerpt),
        coverImage: data.coverImage ? String(data.coverImage) : undefined,
        publishedAt: toIso(data.publishedAt),
        updatedAt: toIso(data.updatedAt),
      };
    });
    console.log(`[prerender] Fetched ${posts.length} posts`);
  } catch (e) {
    console.warn('[prerender] Posts fetch failed:', (e as Error).message);
  }

  let projects: { id: string; title: string; description: string; image?: string; gitUrl?: string; tags?: string[]; type?: string; period?: string }[] = [];
  try {
    const snap = await getDocs(collection(db,'projects'));
    projects = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: String(data.title ?? d.id),
        description: String(data.description ?? ''),
        image: data.image ? String(data.image) : undefined,
        gitUrl: data.gitUrl ? String(data.gitUrl) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        type: data.type ? String(data.type) : undefined,
        period: data.period ? String(data.period) : undefined,
      };
    });
    console.log(`[prerender] Fetched ${projects.length} projects`);
  } catch (e) {
    console.warn('[prerender] Projects fetch failed:', (e as Error).message);
  }

  let count = 0;
  for (const r of STATIC) {
    const fp = r.p === '/' ? './dist/index.html' : `./dist${r.p}/index.html`;
    const c = `${BASE}${r.p}`;
    ensureDir(fp);
    writeFileSync(fp, injectMeta(shell, metaBlock({ title:r.t, desc:r.d, canonical:c })));
    count++;
  }
  for (const p of posts) {
    const fp = `./dist/blog/${p.slug}/index.html`;
    const c = `${BASE}/blog/${p.slug}`;
    const ld = JSON.stringify({
      '@context':'https://schema.org','@type':'BlogPosting',
      headline:p.title,description:p.excerpt,image:p.coverImage,
      datePublished:p.publishedAt,dateModified:p.updatedAt,
      author:{'@type':'Person',name:'Ahmad Alghawi'},
      mainEntityOfPage:{'@type':'WebPage','@id':c}
    });
    ensureDir(fp);
    writeFileSync(fp, injectMeta(shell, metaBlock({ title:`${p.title} — Ahmad Alghawi`, desc:p.excerpt, canonical:c, ogImage:p.coverImage, ogType:'article', jsonLd:ld })));
    count++;
  }
  for (const pr of projects) {
    const fp = `./dist/projects/${pr.id}/index.html`;
    const c = `${BASE}/projects/${pr.id}`;
    const ld = JSON.stringify({
      '@context':'https://schema.org','@type':'CreativeWork',
      name:pr.title,description:pr.description,image:pr.image,url:c,
      codeRepository:pr.gitUrl,programmingLanguage:pr.tags,
      author:{'@type':'Person',name:'Ahmad Alghawi'},
      applicationCategory: pr.type === 'Mobile' ? 'MobileApplication' : 'WebApplication',
      datePublished: pr.period?.split('–')[0]?.trim(),
    });
    ensureDir(fp);
    writeFileSync(fp, injectMeta(shell, metaBlock({ title:`${pr.title} — Ahmad Alghawi`, desc:pr.description, canonical:c, ogImage:pr.image, ogType:'article', jsonLd:ld })));
    count++;
  }
  console.log(`[prerender] ✔ ${count} pages`);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
