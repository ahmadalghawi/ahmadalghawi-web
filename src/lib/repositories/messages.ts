/**
 * Messages repository — contact form submissions.
 *
 * Writes are public (anyone can create) per Firestore Rules.
 * Reads / updates / deletes are admin-only.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { serializeDoc } from './_helpers';
import type { Message } from '../types';

const COLL = 'messages';

export interface NewMessageInput {
  name: string;
  email: string;
  subject?: string;
  body: string;
}

export async function sendMessage(input: NewMessageInput): Promise<void> {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  await addDoc(collection(db, COLL), {
    ...input,
    read: false,
    createdAt: serverTimestamp(),
    userAgent,
  });
}

export async function getAllMessages(): Promise<Message[]> {
  const q = query(collection(db, COLL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeDoc<Message>(d.id, d.data()));
}

export async function markRead(id: string, read = true): Promise<void> {
  await updateDoc(doc(db, COLL, id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}
