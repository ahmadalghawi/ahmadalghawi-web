import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toastListeners, toastsState } from './toast-utils';
import type { ToastEntry } from './toast-utils';

export function ToastViewport() {
  const [toasts, setToasts] = useState<ToastEntry[]>(() => toastsState);

  useEffect(() => {
    const fn = (next: ToastEntry[]) => setToasts(next);
    toastListeners.add(fn);
    return () => {
      toastListeners.delete(fn);
    };
  }, []);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed bottom-4 right-4 z-60 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className={`pointer-events-auto rounded-md px-3 py-2 text-sm shadow-lg backdrop-blur border ${
              t.kind === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : t.kind === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                : 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
