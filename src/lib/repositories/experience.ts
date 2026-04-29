/**
 * Experience repository — CRUD against /experience collection.
 */
import {
  collection,
  doc,
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
import type { Experience } from '../types';

const COLL = 'experience';

export async function getAllExperience(): Promise<Experience[]> {
  const q = query(collection(db, COLL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeDoc<Experience>(d.id, d.data()));
}

export async function upsertExperience(item: Experience): Promise<void> {
  const { id } = item;
  if (!id) throw new Error('Experience id is required');
  await setDoc(
    doc(db, COLL, id),
    { ...stripId(item), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function createExperience(item: Experience): Promise<void> {
  const { id } = item;
  if (!id) throw new Error('Experience id is required');
  await setDoc(doc(db, COLL, id), {
    ...stripId(item),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}

export async function reorderExperience(idsInOrder: string[]): Promise<void> {
  const batch = writeBatch(db);
  idsInOrder.forEach((id, idx) => {
    batch.update(doc(db, COLL, id), { order: idx, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
