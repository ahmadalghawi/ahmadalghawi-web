/**
 * Minimal admin UI primitives — buttons, inputs, modal, confirm dialog.
 * Intentionally small and dependency-light. All dark-themed (zinc-950 base).
 */
import { useEffect, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';

/* ─── Button ───────────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary:   'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 disabled:bg-cyan-500/50',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 disabled:opacity-50',
  ghost:     'bg-transparent hover:bg-zinc-800 text-zinc-300 disabled:opacity-50',
  danger:    'bg-red-500 hover:bg-red-400 text-white disabled:bg-red-500/50',
};

export function Button({ variant = 'primary', loading, icon, children, className = '', disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed border-none ${buttonStyles[variant]} ${className}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

/* ─── Input ────────────────────────────────────────────────────────────── */

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, hint, error, required, children }: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {error ? (
        <span className="text-[11px] text-red-400 mt-1 block">{error}</span>
      ) : hint ? (
        <span className="text-[11px] text-zinc-500 mt-1 block">{hint}</span>
      ) : null}
    </label>
  );
}

const inputClass = 'w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-y min-h-[80px] ${props.className ?? ''}`} />;
}

/* ─── Tag input (chips) ────────────────────────────────────────────────── */

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  function commit() {
    const v = draft.trim();
    if (!v) return;
    if (value.includes(v)) {
      setDraft('');
      return;
    }
    onChange([...value, v]);
    setDraft('');
  }

  return (
    <div className={`${inputClass} flex flex-wrap items-center gap-1.5 min-h-[42px] py-1.5`}>
      {value.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 rounded px-2 py-0.5"
        >
          {t}
          <button
            type="button"
            aria-label={`Remove tag ${t}`}
            title="Remove tag"
            onClick={() => onChange(value.filter((x) => x !== t))}
            className="text-zinc-500 hover:text-red-400 cursor-pointer bg-transparent border-none p-0"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? (placeholder ?? 'Add tag…') : ''}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-600"
      />
    </div>
  );
}

/* ─── Modal ────────────────────────────────────────────────────────────── */

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  // ESC-to-close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidth} bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl my-8`}
          >
            <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                title="Close"
                className="text-zinc-500 hover:text-zinc-200 cursor-pointer bg-transparent border-none p-1"
              >
                <X size={16} />
              </button>
            </header>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ─── Confirm dialog ───────────────────────────────────────────────────── */

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-red-400" />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{message}</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={submitting}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

/* ─── Section heading ──────────────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const { settings } = useAdminSettings();
  const titleClass =
    settings.theme === 'light' ? 'text-slate-900' :
    settings.theme === 'warm'  ? 'text-amber-950' :
                                 'text-zinc-100';
  const descClass =
    settings.theme === 'light' ? 'text-slate-600' :
    settings.theme === 'warm'  ? 'text-amber-800' :
                                 'text-zinc-500';
  return (
    <header className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 className={`text-2xl font-semibold tracking-tight ${titleClass}`}>{title}</h1>
        {description && <p className={`text-sm mt-1 ${descClass}`}>{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ─── Empty / Loading states ───────────────────────────────────────────── */

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-500 py-12 justify-center">
      <Loader2 size={14} className="animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-10 text-center">
      <p className="text-sm text-zinc-300 font-medium">{title}</p>
      {hint && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

