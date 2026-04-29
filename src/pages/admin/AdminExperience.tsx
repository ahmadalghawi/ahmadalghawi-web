/**
 * AdminExperience — list + create / edit / delete + reorder.
 * Bullets are managed as one-per-line in a textarea for simplicity.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';
import {
  getAllExperience,
  createExperience,
  upsertExperience,
  deleteExperience,
  reorderExperience,
} from '../../lib/repositories/experience';
import { invalidateCache } from '../../lib/cache';
import type { Experience } from '../../lib/types';
import {
  Button,
  Field,
  Input,
  Textarea,
  TagInput,
  Modal,
  ConfirmDialog,
  PageHeader,
  LoadingState,
  EmptyState,
} from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';

interface FormState {
  id: string;
  company: string;
  title: string;
  period: string;
  location: string;
  type: string;
  skills: string[];
  bullets: string; // newline-separated for textarea
}

const emptyForm: FormState = {
  id: '',
  company: '',
  title: '',
  period: '',
  location: '',
  type: 'Full-time',
  skills: [],
  bullets: '',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
}

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[] | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Experience | null>(null);

  async function refresh() {
    const fresh = await getAllExperience();
    setItems(fresh);
    invalidateCache('experience');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((err) => pushToast('error', `Failed to load: ${(err as Error).message}`));
  }, []);

  async function handleDelete(item: Experience) {
    try {
      await deleteExperience(item.id);
      pushToast('success', `Deleted "${item.company}"`);
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
      await reorderExperience(next.map((x) => x.id));
      invalidateCache('experience');
    } catch (err) {
      pushToast('error', `Reorder failed: ${(err as Error).message}`);
      await refresh();
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Experience"
        description="Work history shown on the experience.json panel. Most recent first."
        actions={
          <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
            New role
          </Button>
        }
      />

      {items === null ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          title="No experience entries yet"
          action={
            <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
              New role
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {items.map((x, i) => (
            <li
              key={x.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-start gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Briefcase size={15} className="text-emerald-300" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-zinc-100">{x.title}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="text-sm text-cyan-300">{x.company}</span>
                  <span className="text-[10px] uppercase tracking-wide text-zinc-400 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5">
                    {x.type}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                  <span>{x.period}</span>
                  <span>·</span>
                  <span>{x.location}</span>
                </div>
                <div className="text-[11px] text-zinc-600 mt-1">
                  {x.bullets.length} bullet{x.bullets.length === 1 ? '' : 's'} · {x.skills.length} skill{x.skills.length === 1 ? '' : 's'}
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
                  onClick={() => setEditing(x)}
                  aria-label={`Edit ${x.company}`}
                  title="Edit"
                  className="p-1.5 text-zinc-400 hover:text-cyan-300 cursor-pointer bg-transparent border-none"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setConfirmDelete(x)}
                  aria-label={`Delete ${x.company}`}
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

      <ExperienceFormModal
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
        title={`Delete "${confirmDelete?.company}"?`}
        message="This permanently removes the experience entry. This cannot be undone."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete); }}
      />
    </div>
  );
}

/* ─── Form ─────────────────────────────────────────────────────────────── */

function ExperienceFormModal({
  open,
  initial,
  onClose,
  onSaved,
  nextOrder,
  existingIds,
}: {
  open: boolean;
  initial: Experience | null;
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
        company: initial.company,
        title: initial.title,
        period: initial.period,
        location: initial.location,
        type: initial.type,
        skills: [...initial.skills],
        bullets: initial.bullets.join('\n'),
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [open, initial]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleCompanyChange(company: string) {
    update('company', company);
    if (!isEdit && (form.id === '' || form.id === slugify(form.company))) {
      update('id', slugify(company));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.id.trim()) return setError('id is required');
    if (!form.company.trim()) return setError('company is required');
    if (!form.title.trim()) return setError('title is required');
    if (!isEdit && existingIds.has(form.id)) {
      return setError(`An entry with id "${form.id}" already exists`);
    }

    const bullets = form.bullets.split('\n').map((b) => b.trim()).filter(Boolean);

    setSubmitting(true);
    try {
      const payload: Experience = {
        id: form.id,
        company: form.company.trim(),
        title: form.title.trim(),
        period: form.period.trim(),
        location: form.location.trim(),
        type: form.type.trim(),
        skills: form.skills,
        bullets,
        order: initial?.order ?? nextOrder,
      };

      if (isEdit) {
        await upsertExperience(payload);
        pushToast('success', `Saved "${payload.company}"`);
      } else {
        await createExperience(payload);
        pushToast('success', `Created "${payload.company}"`);
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
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit role' : 'New role'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ID" required hint="URL-safe slug. Cannot be changed after creation.">
            <Input
              required
              value={form.id}
              onChange={(e) => update('id', slugify(e.target.value))}
              disabled={isEdit}
              placeholder="cognes-2025"
            />
          </Field>
          <Field label="Type" required hint="e.g. Full-time, Freelance, Contract">
            <Input
              required
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              placeholder="Full-time"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Company" required>
            <Input
              required
              value={form.company}
              onChange={(e) => handleCompanyChange(e.target.value)}
              placeholder="Acme Inc."
            />
          </Field>
          <Field label="Job title" required>
            <Input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Senior Full Stack Engineer"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Period" required>
            <Input
              required
              value={form.period}
              onChange={(e) => update('period', e.target.value)}
              placeholder="Jan 2025 – Present"
            />
          </Field>
          <Field label="Location" required>
            <Input
              required
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="Malmö, SE"
            />
          </Field>
        </div>

        <Field label="Skills" hint="Press Enter or comma to add.">
          <TagInput value={form.skills} onChange={(skills) => update('skills', skills)} placeholder="React, Node.js…" />
        </Field>

        <Field label="Bullet points" hint="One per line. Each becomes a list item on the public site.">
          <Textarea
            value={form.bullets}
            onChange={(e) => update('bullets', e.target.value)}
            placeholder={'Built X using Y\nLed migration of Z\n…'}
            rows={6}
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
            {isEdit ? 'Save changes' : 'Create role'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
