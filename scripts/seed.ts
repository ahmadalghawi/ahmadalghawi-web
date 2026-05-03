/**
 * One-shot Firestore seed script.
 *
 * Reads the current static `src/data/*.ts` content and writes each record into
 * Firestore so the live site can start reading from the backend.
 *
 * Usage (PowerShell):
 *   npm run seed
 *
 * Requirements:
 *   - Node 20.6+  (for `--env-file`)
 *   - tsx installed as devDependency
 *   - Firebase project with Email/Password auth enabled
 *   - `.env` populated with VITE_FIREBASE_* + ADMIN_EMAIL + ADMIN_PASSWORD
 *   - The admin account's UID must match the one hard-coded in firestore.rules
 *
 * This script is idempotent: re-running will overwrite each doc by id (merge).
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import projectsData from '../src/data/projectsData';
import { experiences } from '../src/data/experienceData';
import { testimonials } from '../src/data/testimonialsData';
import { nowItems, nowUpdated } from '../src/data/nowData';
import { defaultCV } from '../src/data/defaultCV';

/* ─── Env plumbing ─────────────────────────────────────────────────────── */

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
  if (!v) {
    console.error(`[seed] Missing env var: ${k}`);
    process.exit(1);
  }
  env[k] = v;
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

/* ─── Init + auth ──────────────────────────────────────────────────────── */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  console.log('[seed] Signing in as admin…');
  const cred = await signInWithEmailAndPassword(auth, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
  console.log(`[seed] Signed in as ${cred.user.email} (uid=${cred.user.uid})`);

  await seedProjects();
  await seedExperience();
  await seedTestimonials();
  await seedNow();
  await seedCV();

  console.log('\n[seed] ✔ All collections seeded successfully.');
  process.exit(0);
}

/* ─── Collection seeders ───────────────────────────────────────────────── */

async function seedProjects() {
  console.log(`[seed] projects (${projectsData.length})…`);
  const batch = writeBatch(db);
  projectsData.forEach((p, idx) => {
    batch.set(
      doc(db, 'projects', p.id),
      {
        title: p.title,
        description: p.description,
        tags: p.tags,
        type: p.type,
        image: p.image,
        gitUrl: p.gitUrl,
        previewUrl: p.previewUrl ?? null,
        period: p.period ?? null,
        order: idx,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
  await batch.commit();
}

async function seedExperience() {
  console.log(`[seed] experience (${experiences.length})…`);
  const batch = writeBatch(db);
  experiences.forEach((e, idx) => {
    batch.set(
      doc(db, 'experience', e.id),
      {
        company: e.company,
        title: e.title,
        period: e.period,
        location: e.location,
        type: e.type,
        skills: e.skills,
        bullets: e.bullets,
        order: idx,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
  await batch.commit();
}

async function seedTestimonials() {
  console.log(`[seed] testimonials (${testimonials.length})…`);
  const batch = writeBatch(db);
  testimonials.forEach((t, idx) => {
    // Static testimonials have no id — derive a stable one from author + company
    const id = slug(`${t.author}-${t.company}`);
    batch.set(
      doc(db, 'testimonials', id),
      {
        quote: t.quote,
        author: t.author,
        role: t.role,
        company: t.company,
        order: idx,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
  await batch.commit();
}

async function seedNow() {
  console.log(`[seed] now (${nowItems.length} items + meta)…`);
  const batch = writeBatch(db);
  nowItems.forEach((n, idx) => {
    const id = slug(n.label);
    batch.set(
      doc(db, 'now', id),
      {
        label: n.label,
        value: n.value,
        order: idx,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });
  batch.set(
    doc(db, 'meta', 'now'),
    { updated: nowUpdated, updatedAt: serverTimestamp() },
    { merge: true },
  );
  await batch.commit();
}

async function seedCV() {
  console.log('[seed] cv/main …');
  await setDoc(
    doc(db, 'cv', 'main'),
    { ...defaultCV, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/* ─── Utils ────────────────────────────────────────────────────────────── */

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

main().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
