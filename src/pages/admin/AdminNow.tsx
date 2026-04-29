/**
 * AdminNow — manages the /now collection (label/value items) plus the
 * /meta/now document (free-form "updated" date string).
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Sparkles, Save } from 'lucide-react';
import {
  getNow,
  upsertNowItem,
  deleteNowItem,
  reorderNowItems,
  setNowUpdated,
} from '../../lib/repositories/now';
import { invalidateCache } from '../../lib/cache';
import type { NowItem } from '../../lib/types';
import {
  Button,
  Field,
  Input,
  Modal,
  ConfirmDialog,
  PageHeader,
  LoadingState,
  EmptyState,
} from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';

interface FormState {
  id: string;
  label: string;
  value: string;
}

const emptyForm: FormState = { id: '', label: '', value: '' };

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
}

export default function AdminNow() {
  const [items, setItems] = useState<NowItem[] | null>(null);
  const [updated, setUpdated] = useState<string>('');
  const [updatedSaving, setUpdatedSaving] = useState(false);
  const [editing, setEditing] = useState<NowItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<NowItem | null>(null);

  async function refresh() {
    const fresh = await getNow();
    setItems(fresh.items);
    setUpdated(fresh.updated);
    invalidateCache('now');
  }

  useEffect(() => {
    refresh().catch((err) => pushToast('error', `Failed to load: ${(err as Error).message}`));
  }, []);

  async function handleSaveUpdated() {
    setUpdatedSaving(true);
    try {
      await setNowUpdated(updated.trim());
      invalidateCache('now');
      pushToast('success', 'Updated date saved');
    } catch (err) {
      pushToast('error', (err as Error).message);
    } finally {
      setUpdatedSaving(false);
    }
  }

  async function handleDelete(item: NowItem) {
    try {
      await deleteNowItem(item.id);
      pushToast('success', `Deleted "${item.label}"`);
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
      await reorderNowItems(next.map((x) => x.id));
      invalidateCache('now');
    } catch (err) {
      pushToast('error', `Reorder failed: ${(err as Error).message}`);
      await refresh();
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Now"
        description="What you're currently building, learning, reading, listening to. Shown in now.md."
        actions={
          <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
            New entry
          </Button>
        }
      />

      {/* Updated meta field */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-6 flex items-end gap-3">
        <Field label='Updated label' hint='Free-form. Shown as "updated {value}" on the public site.'>
          <Input
            value={updated}
            onChange={(e) => setUpdated(e.target.value)}
            placeholder="2025-10-01"
          />
        </Field>
        <Button variant="secondary" icon={<Save size={14} />} onClick={handleSaveUpdated} loading={updatedSaving}>
          Save
        </Button>
      </div>

      {items === null ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          title="No now-entries yet"
          action={
            <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
              New entry
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n, i) => (
            <li
              key={n.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <Sparkles size={15} className="text-yellow-300" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-cyan-300 w-24 shrink-0">{n.label}:</span>
                  <span className="text-sm text-zinc-200 truncate">{n.value}</span>
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
                  onClick={() => setEditing(n)}
                  aria-label={`Edit ${n.label}`}
                  title="Edit"
                  className="p-1.5 text-zinc-400 hover:text-cyan-300 cursor-pointer bg-transparent border-none"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setConfirmDelete(n)}
                  aria-label={`Delete ${n.label}`}
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

      <NowFormModal
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
        title={`Delete "${confirmDelete?.label}"?`}
        message="This permanently removes the entry. This cannot be undone."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete); }}
      />
    </div>
  );
}

/* ─── Form ─────────────────────────────────────────────────────────────── */

function NowFormModal({
  open,
  initial,
  onClose,
  onSaved,
  nextOrder,
  existingIds,
}: {
  open: boolean;
  initial: NowItem | null;
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
      setForm({ id: initial.id, label: initial.label, value: initial.value });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [open, initial]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleLabelChange(label: string) {
    update('label', label);
    if (!isEdit && (form.id === '' || form.id === slugify(form.label))) {
      update('id', slugify(label));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.id.trim()) return setError('id is required');
    if (!form.label.trim()) return setError('label is required');
    if (!form.value.trim()) return setError('value is required');
    if (!isEdit && existingIds.has(form.id)) {
      return setError(`An entry with id "${form.id}" already exists`);
    }

    setSubmitting(true);
    try {
      const payload: NowItem = {
        id: form.id,
        label: form.label.trim(),
        value: form.value.trim(),
        order: initial?.order ?? nextOrder,
      };
      await upsertNowItem(payload);
      pushToast('success', isEdit ? 'Saved' : 'Created');
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
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit entry' : 'New entry'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="ID" required hint="URL-safe slug. Cannot be changed after creation.">
          <Input
            required
            value={form.id}
            onChange={(e) => update('id', slugify(e.target.value))}
            disabled={isEdit}
            placeholder="building"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Label" required hint="Short tag, e.g. Building, Learning, Reading.">
            <Input
              required
              value={form.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Building"
            />
          </Field>
          <Field label="Value" required hint="What you're up to.">
            <Input
              required
              value={form.value}
              onChange={(e) => update('value', e.target.value)}
              placeholder="A new portfolio CMS"
            />
          </Field>
        </div>

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
            {isEdit ? 'Save changes' : 'Create entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
