/**
 * Now repository — CRUD against /now collection + /meta/now singleton for
 * the "last updated" timestamp string.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import { serializeDoc, stripId } from './_helpers';
import type { NowItem } from '../types';

const COLL = 'now';
const META_DOC = 'meta/now';

export interface NowPayload {
  items: NowItem[];
  updated: string; // free-form date string like "2025-10-01"
}

export async function getNow(): Promise<NowPayload> {
  const q = query(collection(db, COLL), orderBy('order', 'asc'));
  const [itemsSnap, metaSnap] = await Promise.all([getDocs(q), getDoc(doc(db, META_DOC))]);
  const items = itemsSnap.docs.map((d) => serializeDoc<NowItem>(d.id, d.data()));
  const updated = (metaSnap.exists() ? (metaSnap.data().updated as string) : '') ?? '';
  return { items, updated };
}

export async function upsertNowItem(item: NowItem): Promise<void> {
  const { id } = item;
  if (!id) throw new Error('Now item id is required');
  await setDoc(
    doc(db, COLL, id),
    { ...stripId(item), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function deleteNowItem(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}

export async function reorderNowItems(idsInOrder: string[]): Promise<void> {
  const batch = writeBatch(db);
  idsInOrder.forEach((id, idx) => {
    batch.update(doc(db, COLL, id), { order: idx });
  });
  await batch.commit();
}

export async function setNowUpdated(updated: string): Promise<void> {
  await setDoc(doc(db, META_DOC), { updated, updatedAt: serverTimestamp() }, { merge: true });
}
