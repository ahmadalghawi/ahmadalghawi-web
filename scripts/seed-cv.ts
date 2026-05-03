/**
 * Standalone Firestore seed script for the single CV document (cv/main).
 *
 * Pushes the same `defaultCV` payload that the public page falls back to,
 * so the admin dashboard (/admin/cv) becomes the live source of truth.
 *
 * Usage (PowerShell):
 *   npm run seed:cv
 *
 * Idempotent: re-running overwrites with merge:true.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { defaultCV } from '../src/data/defaultCV';

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
  if (!v) { console.error(`[seed:cv] Missing env var: ${k}`); process.exit(1); }
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

async function main() {
  console.log('[seed:cv] Signing in as admin…');
  const cred = await signInWithEmailAndPassword(auth, env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
  console.log(`[seed:cv] Signed in as ${cred.user.email} (uid=${cred.user.uid})`);

  await setDoc(
    doc(db, 'cv', 'main'),
    { ...defaultCV, updatedAt: serverTimestamp() },
    { merge: true },
  );
  console.log('[seed:cv] ✔ cv/main seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed:cv] Failed:', err);
  process.exit(1);
});
