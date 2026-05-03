/**
 * Projects repository — CRUD against /projects collection.
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
import type { Project } from '../types';
import staticProjects from '../../data/projectsData';

const COLL = 'projects';

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, COLL), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeDoc<Project>(d.id, d.data()));
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const d = await getDoc(doc(db, COLL, id));
    if (d.exists()) return serializeDoc<Project>(d.id, d.data());
  } catch {
    /* network / permissions — fall through to static */
  }
  // Fallback: the Firestore doc may not exist yet (unseeded), so try the
  // built-in static project catalog. Keeps case-study URLs working out-of-box.
  const staticMatch = staticProjects.find((p) => p.id === id);
  if (staticMatch) {
    return { ...staticMatch, order: staticProjects.indexOf(staticMatch) };
  }
  return null;
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
