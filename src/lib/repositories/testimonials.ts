/**
 * Testimonials repository — CRUD against /testimonials collection.
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
import type { Testimonial } from '../types';

const COLL = 'testimonials';

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const q = query(collection(db, COLL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeDoc<Testimonial>(d.id, d.data()));
}

export async function upsertTestimonial(item: Testimonial): Promise<void> {
  const { id } = item;
  if (!id) throw new Error('Testimonial id is required');
  await setDoc(
    doc(db, COLL, id),
    { ...stripId(item), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function createTestimonial(item: Testimonial): Promise<void> {
  const { id } = item;
  if (!id) throw new Error('Testimonial id is required');
  await setDoc(doc(db, COLL, id), {
    ...stripId(item),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}

export async function reorderTestimonials(idsInOrder: string[]): Promise<void> {
  const batch = writeBatch(db);
  idsInOrder.forEach((id, idx) => {
    batch.update(doc(db, COLL, id), { order: idx, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
