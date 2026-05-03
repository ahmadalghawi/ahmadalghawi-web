/**
 * Posts repository — CRUD against /posts collection.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { serializeDoc, stripId } from './_helpers';
import type { Post } from '../types';

const COLL = 'posts';

export async function getAllPosts(): Promise<Post[]> {
  const snap = await getDocs(collection(db, COLL));
  return snap.docs
    .map((d) => serializeDoc<Post>(d.id, d.data()))
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const q = query(collection(db, COLL), where('published', '==', true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => serializeDoc<Post>(d.id, d.data()))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(collection(db, COLL), where('slug', '==', slug), where('published', '==', true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return serializeDoc<Post>(d.id, d.data());
}

export async function upsertPost(post: Post): Promise<void> {
  const { id } = post;
  if (!id) throw new Error('Post id is required');
  // Read existing doc to check if publishedAt is already set
  const existingSnap = await getDoc(doc(db, COLL, id));
  const existingData = existingSnap.data();
  const alreadyHasPublishedAt = !!existingData?.publishedAt;
  const payload: Record<string, unknown> = {
    ...stripId(post),
    updatedAt: serverTimestamp(),
  };
  // Set publishedAt only on first publish transition; never overwrite
  if (post.published && !alreadyHasPublishedAt) {
    payload.publishedAt = serverTimestamp();
  }
  await setDoc(doc(db, COLL, id), payload, { merge: true });
}

export async function createPost(post: Post): Promise<void> {
  const { id } = post;
  if (!id) throw new Error('Post id is required');
  const payload: Record<string, unknown> = {
    ...stripId(post),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (post.published) {
    payload.publishedAt = serverTimestamp();
  }
  await setDoc(doc(db, COLL, id), payload);
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}

export async function publishPost(id: string, published: boolean): Promise<void> {
  const existingSnap = await getDoc(doc(db, COLL, id));
  const existingData = existingSnap.data();
  const payload: Record<string, unknown> = {
    published,
    updatedAt: serverTimestamp(),
  };
  // Set publishedAt once on first publish; preserve it on unpublish
  if (published && !existingData?.publishedAt) {
    payload.publishedAt = serverTimestamp();
  }
  await setDoc(doc(db, COLL, id), payload, { merge: true });
}
