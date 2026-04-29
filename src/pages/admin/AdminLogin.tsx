/**
 * Admin login page — clean, minimal, dark themed.
 * Lives outside the VS Code shell.
 */
import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in as admin? Skip the form.
  if (user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      const msg =
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? 'Invalid email or password.'
          : code === 'auth/too-many-requests'
          ? 'Too many attempts. Try again in a minute.'
          : (err as Error).message || 'Sign-in failed.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <Lock className="text-cyan-400" size={20} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin sign-in</h1>
          <p className="text-sm text-zinc-500 mt-1">Restricted to the portfolio owner.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-zinc-400 mb-1.5 block">Email</span>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-zinc-400 mb-1.5 block">Password</span>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-medium rounded-lg py-2.5 text-sm transition-colors cursor-pointer border-none"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-6">
          ← <a href="/" className="hover:text-zinc-400 transition-colors">Back to portfolio</a>
        </p>
      </motion.div>
    </div>
  );
}
