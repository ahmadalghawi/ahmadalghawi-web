/**
 * AuthContext — wraps Firebase Auth state for the admin panel.
 *
 * Exposes:
 *   user        — the currently signed-in Firebase User, or null
 *   isAdmin     — true iff `user.uid === ADMIN_UID`
 *   loading     — true on first load before onAuthStateChanged fires
 *   signIn(...) — email/password login
 *   signOut()   — sign out of the current session
 */
import { useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { auth, ADMIN_UID } from '../lib/firebase';
import { AuthContext } from '../lib/auth-context';
import type { AuthContextValue } from '../lib/auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => auth.currentUser);
  const [loading, setLoading] = useState<boolean>(() => auth.currentUser === null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value: AuthContextValue = {
    user,
    isAdmin: !!user && user.uid === ADMIN_UID,
    loading,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signOut: async () => {
      await fbSignOut(auth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

