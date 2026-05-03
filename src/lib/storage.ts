/**
 * Firebase Storage helpers.
 *
 * Uploads return { url, path } — persist both in Firestore so we can display
 * the image (url) and later delete the object (path).
 */
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadedImage {
  url: string;
  path: string;
}

function extensionOf(file: File): string {
  const m = /\.([a-zA-Z0-9]+)$/.exec(file.name);
  return m ? m[1].toLowerCase() : 'png';
}

/**
 * Upload a project cover image under /projects/{id}/cover.{ext}.
 * Overwrites any existing object at the same path.
 */
export async function uploadProjectImage(projectId: string, file: File): Promise<UploadedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`Expected image file, got ${file.type || 'unknown'}`);
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image too large — max 5 MB');
  }

  const path = `projects/${projectId}/cover.${extensionOf(file)}`;
  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, file, { contentType: file.type });
  const url = await getDownloadURL(objectRef);
  return { url, path };
}

/**
 * Upload a gallery screenshot under /projects/{id}/gallery/{timestamp}.{ext}.
 * Each upload gets a unique filename so multiple gallery images coexist.
 */
export async function uploadProjectGalleryImage(projectId: string, file: File): Promise<UploadedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`Expected image file, got ${file.type || 'unknown'}`);
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image too large — max 5 MB');
  }

  const path = `projects/${projectId}/gallery/${Date.now()}.${extensionOf(file)}`;
  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, file, { contentType: file.type });
  const url = await getDownloadURL(objectRef);
  return { url, path };
}

/**
 * Generic upload to an arbitrary path (e.g. /cv/Resume.pdf).
 */
export async function uploadAtPath(path: string, file: File, maxBytes = 10 * 1024 * 1024): Promise<UploadedImage> {
  if (file.size > maxBytes) {
    throw new Error(`File too large — max ${Math.round(maxBytes / 1024 / 1024)} MB`);
  }
  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, file, { contentType: file.type });
  const url = await getDownloadURL(objectRef);
  return { url, path };
}

/**
 * Delete a Storage object by path. Silently ignores "not found" errors so
 * callers can safely call this even when the original upload failed.
 */
export async function deleteByPath(path: string): Promise<void> {
  try {
    await deleteObject(ref(storage, path));
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code !== 'storage/object-not-found') throw err;
  }
}
