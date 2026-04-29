/**
 * AdminTestimonials — list + create / edit / delete + reorder.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Quote } from 'lucide-react';
import {
  getAllTestimonials,
  createTestimonial,
  upsertTestimonial,
  deleteTestimonial,
} from '../../lib/repositories/testimonials';
import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { invalidateCache } from '../../lib/cache';
import type { Testimonial } from '../../lib/types';
import {
  Button,
  Field,
  Input,
  Textarea,
  Modal,
  ConfirmDialog,
  PageHeader,
  LoadingState,
  EmptyState,
} from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';

interface FormState {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

const emptyForm: FormState = {
  id: '',
  quote: '',
  author: '',
  role: '',
  company: '',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
}

async function reorderTestimonialsLocal(idsInOrder: string[]) {
  const batch = writeBatch(db);
  idsInOrder.forEach((id, idx) => {
    batch.update(doc(db, 'testimonials', id), { order: idx });
  });
  await batch.commit();
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null);

  async function refresh() {
    const fresh = await getAllTestimonials();
    setItems(fresh);
    invalidateCache('testimonials');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((err) => pushToast('error', `Failed to load: ${(err as Error).message}`));
  }, []);

  async function handleDelete(item: Testimonial) {
    try {
      await deleteTestimonial(item.id);
      pushToast('success', `Deleted testimonial from "${item.author}"`);
      setConfirmDelete(null);
      await refresh();
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  }

  async function handleMove(idx: number, dir: -1 | 1) {
    if (!items) return;
    const next = [...items];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next.map((x, i) => ({ ...x, order: i })));
    try {
      await reorderTestimonialsLocal(next.map((x) => x.id));
      invalidateCache('testimonials');
    } catch (err) {
      pushToast('error', `Reorder failed: ${(err as Error).message}`);
      await refresh();
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Testimonials"
        description="Recommendations shown in the recommendations.md panel."
        actions={
          <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
            New testimonial
          </Button>
        }
      />

      {items === null ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          action={
            <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
              New testimonial
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {items.map((t, i) => (
            <li
              key={t.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-start gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Quote size={15} className="text-purple-300" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 leading-relaxed line-clamp-2 italic">"{t.quote}"</p>
                <div className="text-xs text-zinc-500 mt-1.5 flex items-center gap-2">
                  <span className="text-cyan-300">{t.author}</span>
                  <span>·</span>
                  <span>{t.role}</span>
                  <span>·</span>
                  <span>{t.company}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMove(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  title="Move up"
                  className="p-1.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => handleMove(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  title="Move down"
                  className="p-1.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => setEditing(t)}
                  aria-label={`Edit testimonial from ${t.author}`}
                  title="Edit"
                  className="p-1.5 text-zinc-400 hover:text-cyan-300 cursor-pointer bg-transparent border-none"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setConfirmDelete(t)}
                  aria-label={`Delete testimonial from ${t.author}`}
                  title="Delete"
                  className="p-1.5 text-zinc-400 hover:text-red-400 cursor-pointer bg-transparent border-none"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <TestimonialFormModal
        open={creating || !!editing}
        initial={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={async () => {
          setCreating(false);
          setEditing(null);
          await refresh();
        }}
        nextOrder={items?.length ?? 0}
        existingIds={new Set((items ?? []).map((x) => x.id))}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete testimonial from "${confirmDelete?.author}"?`}
        message="This permanently removes the testimonial. This cannot be undone."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete); }}
      />
    </div>
  );
}

/* ─── Form ─────────────────────────────────────────────────────────────── */

function TestimonialFormModal({
  open,
  initial,
  onClose,
  onSaved,
  nextOrder,
  existingIds,
}: {
  open: boolean;
  initial: Testimonial | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  nextOrder: number;
  existingIds: Set<string>;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        id: initial.id,
        quote: initial.quote,
        author: initial.author,
        role: initial.role,
        company: initial.company,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [open, initial]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAuthorChange(author: string) {
    update('author', author);
    if (!isEdit && (form.id === '' || form.id === slugify(`${form.author}-${form.company}`))) {
      update('id', slugify(`${author}-${form.company}`));
    }
  }

  function handleCompanyChange(company: string) {
    update('company', company);
    if (!isEdit && (form.id === '' || form.id === slugify(`${form.author}-${form.company}`))) {
      update('id', slugify(`${form.author}-${company}`));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.id.trim()) return setError('id is required');
    if (!form.quote.trim()) return setError('quote is required');
    if (!form.author.trim()) return setError('author is required');
    if (!isEdit && existingIds.has(form.id)) {
      return setError(`A testimonial with id "${form.id}" already exists`);
    }

    setSubmitting(true);
    try {
      const payload: Testimonial = {
        id: form.id,
        quote: form.quote.trim(),
        author: form.author.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        order: initial?.order ?? nextOrder,
      };

      if (isEdit) {
        await upsertTestimonial(payload);
        pushToast('success', 'Saved');
      } else {
        await createTestimonial(payload);
        pushToast('success', 'Created');
      }
      await onSaved();
    } catch (err) {
      const msg = (err as Error).message ?? 'Save failed';
      setError(msg);
      pushToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit testimonial' : 'New testimonial'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="ID" required hint="URL-safe slug. Cannot be changed after creation.">
          <Input
            required
            value={form.id}
            onChange={(e) => update('id', slugify(e.target.value))}
            disabled={isEdit}
            placeholder="jane-doe-acme-corp"
          />
        </Field>

        <Field label="Quote" required>
          <Textarea
            required
            value={form.quote}
            onChange={(e) => update('quote', e.target.value)}
            placeholder="What they said about working with you…"
            rows={4}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Author" required>
            <Input
              required
              value={form.author}
              onChange={(e) => handleAuthorChange(e.target.value)}
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Role">
            <Input
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              placeholder="Engineering Manager"
            />
          </Field>
        </div>

        <Field label="Company">
          <Input
            value={form.company}
            onChange={(e) => handleCompanyChange(e.target.value)}
            placeholder="Acme Corp"
          />
        </Field>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-md p-3">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? 'Save changes' : 'Create testimonial'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
