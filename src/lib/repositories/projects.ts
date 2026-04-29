/**
 * Projects repository — CRUD against /projects collection.
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
import type { Project } from '../types';

const COLL = 'projects';

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, COLL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeDoc<Project>(d.id, d.data()));
}

export async function upsertProject(project: Project): Promise<void> {
  const { id } = project;
  if (!id) throw new Error('Project id is required');
  const payload = {
    ...stripId(project),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, COLL, id), payload, { merge: true });
}

export async function createProject(project: Project): Promise<void> {
  const { id } = project;
  if (!id) throw new Error('Project id is required');
  const payload = {
    ...stripId(project),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, COLL, id), payload);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}

/**
 * Bulk update order on reorder-drag. Uses a single batch write.
 */
export async function reorderProjects(idsInOrder: string[]): Promise<void> {
  const batch = writeBatch(db);
  idsInOrder.forEach((id, idx) => {
    batch.update(doc(db, COLL, id), { order: idx, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
