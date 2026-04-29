/**
 * Firebase SDK initialization.
 *
 * Reads VITE_FIREBASE_* environment variables from the project-root `.env` file.
 * All services used across the app are exported from here so we initialize once.
 *
 * Note: Firebase web API keys are PUBLIC identifiers, not secrets. Security is
 * enforced by Firestore / Storage Security Rules. See firestore.rules.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported as analyticsSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Fail fast during development if the env file is missing
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    '[firebase] Missing VITE_FIREBASE_* env vars. Copy .env.example to .env and fill in your Firebase config.',
  );
}

// Guard against hot-reload double-init during dev
export const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// Analytics is async and only available in browsers that support it (not SSR, not file://)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analyticsSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {
      /* silent — analytics is optional */
    });
}

/**
 * The single admin UID authorized to write to Firestore.
 * Mirrors the `isAdmin()` function in firestore.rules.
 */
export const ADMIN_UID = 'vRp35jjNzXf12MyPwMSgyudTZk23';
