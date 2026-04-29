/**
 * CV repository — single-doc at /cv/main holding the whole résumé tree.
 */
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
