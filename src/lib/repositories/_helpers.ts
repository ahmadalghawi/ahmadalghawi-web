/**
 * Shared helpers for Firestore repositories.
 */
import { Timestamp, type DocumentData } from 'firebase/firestore';

/**
 * Convert a Firestore document payload into a plain object suitable for React state:
 *   - Timestamps → ISO strings
 *   - Nested objects / arrays preserved as-is
 */
export function serializeDoc<T>(id: string, data: DocumentData): T {
  const out: Record<string, unknown> = { id };
  for (const [k, v] of Object.entries(data)) {
    out[k] = v instanceof Timestamp ? v.toDate().toISOString() : v;
  }
  return out as T;
}

/**
 * Strip the `id` field before writing — Firestore doesn't store ids in docs.
 */
export function stripId<T extends { id?: string }>(payload: T): Omit<T, 'id'> {
  const { id: _id, ...rest } = payload;
  void _id;
  return rest;
}
