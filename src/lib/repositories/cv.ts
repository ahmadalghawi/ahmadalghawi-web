/**
 * CV repository — single-doc at /cv/main holding the whole résumé tree.
 * Plus analytics (cv_views) for tokenized link tracking.
 */
import {
  doc, getDoc, setDoc, serverTimestamp,
  collection, query, orderBy, limit, getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { CVDoc } from '../types';

const DOC_PATH = 'cv/main';

export async function getCV(): Promise<CVDoc | null> {
  const snap = await getDoc(doc(db, DOC_PATH));
  if (!snap.exists()) return null;
  const data = snap.data() as CVDoc;
  return data;
}

export async function saveCV(cv: CVDoc): Promise<void> {
  await setDoc(doc(db, DOC_PATH), { ...cv, updatedAt: serverTimestamp() }, { merge: true });
}

/* ── CV view analytics (tokenized links) ─────────────────────────────── */

export interface CVViewRecord {
  id?: string;
  token: string;
  viewedAt?: string; // ISO after serialization
  userAgent?: string;
  language?: string;
  referrer?: string;
}

export async function recordCVView(token: string): Promise<void> {
  await addDoc(collection(db, 'cv_views'), {
    token,
    viewedAt: serverTimestamp(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    referrer: document.referrer || '',
  });
}

export async function getRecentCVViews(limitCount = 50): Promise<CVViewRecord[]> {
  const q = query(collection(db, 'cv_views'), orderBy('viewedAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      token: data.token as string,
      viewedAt: data.viewedAt?.toDate?.()?.toISOString?.() ?? data.viewedAt,
      userAgent: data.userAgent as string | undefined,
      language: data.language as string | undefined,
      referrer: data.referrer as string | undefined,
    };
  });
}
