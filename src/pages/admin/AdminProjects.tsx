/**
 * AdminProjects — list + create / edit / delete + image upload + reorder.
 *
 * Bypasses the SWR cache for a fresh read on mount so admin always sees the
 * latest data; invalidates the public cache after each mutation.
 */
import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Upload, ImageOff, X, Link2 } from 'lucide-react';
import {
  getAllProjects,
  createProject,
  upsertProject,
  deleteProject,
  reorderProjects,
} from '../../lib/repositories/projects';
import { uploadProjectImage, uploadProjectGalleryImage, deleteByPath } from '../../lib/storage';
import { invalidateCache } from '../../lib/cache';
import type { Project } from '../../lib/types';
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

const TYPES: Project['type'][] = ['Web', 'Mobile', 'Both'];

interface FormState {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: Project['type'];
  image: string;
  imagePath: string;
  gitUrl: string;
  previewUrl: string;
  period: string;
  caseStudy: string;
  gallery: string[];
  problem: string;
  outcome: string;
  architecture: string;
}

const emptyForm: FormState = {
  id: '',
  title: '',
  description: '',
  tags: [],
  type: 'Web',
  image: '',
  imagePath: '',
  gitUrl: '',
  previewUrl: '',
  period: '',
  caseStudy: '',
  gallery: [],
  problem: '',
  outcome: '',
  architecture: '',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  async function refresh() {
    const fresh = await getAllProjects();
    setProjects(fresh);
    invalidateCache('projects'); // public site re-fetches on next mount
  }

  useEffect(() => {
    // Canonical "load on mount" pattern. The setState lives inside the
    // promise resolution, not synchronously inside the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((err) => {
      pushToast('error', `Failed to load: ${(err as Error).message}`);
    });
  }, []);

  async function handleDelete(p: Project) {
    try {
      await deleteProject(p.id);
      // Best-effort image cleanup; ignore failures
      if (p.imagePath) await deleteByPath(p.imagePath).catch(() => {});
      pushToast('success', `Deleted "${p.title}"`);
      setConfirmDelete(null);
      await refresh();
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  }

  async function handleMove(idx: number, dir: -1 | 1) {
    if (!projects) return;
    const next = [...projects];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setProjects(next.map((p, i) => ({ ...p, order: i })));
    try {
      await reorderProjects(next.map((p) => p.id));
      invalidateCache('projects');
    } catch (err) {
      pushToast('error', `Reorder failed: ${(err as Error).message}`);
      await refresh();
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Projects"
        description="Manage portfolio showcase entries. Drag-order via arrow buttons; first item appears top-left on the public site."
        actions={
          <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
            New project
          </Button>
        }
      />

      {projects === null ? (
        <LoadingState />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          hint="Create your first project to get started."
          action={
            <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
              New project
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {projects.map((p, i) => (
            <li
              key={p.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex items-center gap-4 hover:border-zinc-700 transition-colors"
            >
              {/* Image */}
              <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={16} className="text-zinc-600" />
                )}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100 truncate">{p.title}</span>
                  <span className="text-[10px] uppercase tracking-wide text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded px-1.5 py-0.5">
                    {p.type}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{p.description}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600 font-mono">
                  <span>id: {p.id}</span>
                  {p.period && <span>· {p.period}</span>}
                </div>
              </div>

              {/* Actions */}
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
                  disabled={i === projects.length - 1}
                  aria-label="Move down"
                  title="Move down"
                  className="p-1.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => setEditing(p)}
                  aria-label={`Edit ${p.title}`}
                  title="Edit"
                  className="p-1.5 text-zinc-400 hover:text-cyan-300 cursor-pointer bg-transparent border-none"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setConfirmDelete(p)}
                  aria-label={`Delete ${p.title}`}
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

      {/* Create / Edit modal */}
      <ProjectFormModal
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
        nextOrder={projects?.length ?? 0}
        existingIds={new Set((projects ?? []).map((p) => p.id))}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.title}"?`}
        message="This permanently removes the project and its cover image. This cannot be undone."
        confirmLabel="Delete project"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete); }}
      />
    </div>
  );
}

/* ─── Create / Edit form ───────────────────────────────────────────────── */

function ProjectFormModal({
  open,
  initial,
  onClose,
  onSaved,
  nextOrder,
  existingIds,
}: {
  open: boolean;
  initial: Project | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  nextOrder: number;
  existingIds: Set<string>;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        id: initial.id,
        title: initial.title,
        description: initial.description,
        tags: [...initial.tags],
        type: initial.type,
        image: initial.image,
        imagePath: initial.imagePath ?? '',
        gitUrl: initial.gitUrl,
        previewUrl: initial.previewUrl ?? '',
        period: initial.period ?? '',
        caseStudy: initial.caseStudy ?? '',
        gallery: initial.gallery ?? [],
        problem: initial.problem ?? '',
        outcome: initial.outcome ?? '',
        architecture: initial.architecture ?? '',
      });
      setImagePreview(initial.image);
    } else {
      setForm(emptyForm);
      setImagePreview('');
    }
    setImageFile(null);
    setError(null);
  }, [open, initial]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function pickImage(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast('error', 'Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      pushToast('error', 'Image too large (max 5 MB)');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  /* ── Gallery uploads (Firebase Storage) ───────────────────────────── */

  async function uploadGalleryFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!form.id.trim()) {
      pushToast('error', 'Set the project id first — gallery uploads need a folder.');
      return;
    }
    setGalleryUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadProjectGalleryImage(form.id, file);
        uploaded.push(url);
      }
      update('gallery', [...form.gallery, ...uploaded]);
      pushToast('success', `Uploaded ${uploaded.length} image${uploaded.length > 1 ? 's' : ''}`);
    } catch (err) {
      pushToast('error', (err as Error).message ?? 'Upload failed');
    } finally {
      setGalleryUploading(false);
    }
  }

  function addGalleryByUrl() {
    const url = galleryUrlInput.trim();
    if (!url) return;
    if (form.gallery.includes(url)) {
      pushToast('error', 'Already in gallery');
      return;
    }
    update('gallery', [...form.gallery, url]);
    setGalleryUrlInput('');
  }

  function removeGalleryAt(idx: number) {
    update('gallery', form.gallery.filter((_, i) => i !== idx));
  }

  // Auto-derive id from title when creating
  function handleTitleChange(title: string) {
    update('title', title);
    if (!isEdit && (form.id === '' || form.id === slugify(form.title))) {
      update('id', slugify(title));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate
    if (!form.id.trim()) return setError('id is required');
    if (!form.title.trim()) return setError('title is required');
    if (!form.description.trim()) return setError('description is required');
    if (!form.gitUrl.trim()) return setError('gitUrl is required');
    if (!isEdit && existingIds.has(form.id)) {
      return setError(`A project with id "${form.id}" already exists`);
    }

    setSubmitting(true);
    try {
      let image = form.image;
      let imagePath = form.imagePath;

      // Upload new image if user selected one
      if (imageFile) {
        const uploaded = await uploadProjectImage(form.id, imageFile);
        // If replacing an old image at a different path, delete the old object
        if (imagePath && imagePath !== uploaded.path) {
          await deleteByPath(imagePath).catch(() => {});
        }
        image = uploaded.url;
        imagePath = uploaded.path;
      }

      const payload: Project = {
        id: form.id,
        title: form.title.trim(),
        description: form.description.trim(),
        tags: form.tags,
        type: form.type,
        image,
        imagePath: imagePath || undefined,
        gitUrl: form.gitUrl.trim(),
        previewUrl: form.previewUrl.trim() || undefined,
        period: form.period.trim() || undefined,
        order: initial?.order ?? nextOrder,
        caseStudy: form.caseStudy.trim() || undefined,
        gallery: form.gallery.length > 0 ? form.gallery : undefined,
        problem: form.problem.trim() || undefined,
        outcome: form.outcome.trim() || undefined,
        architecture: form.architecture.trim() || undefined,
      };

      if (isEdit) {
        await upsertProject(payload);
        pushToast('success', `Saved "${payload.title}"`);
      } else {
        await createProject(payload);
        pushToast('success', `Created "${payload.title}"`);
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
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit project' : 'New project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ID" required hint="URL-safe slug. Cannot be changed after creation.">
            <Input
              required
              value={form.id}
              onChange={(e) => update('id', slugify(e.target.value))}
              disabled={isEdit}
              placeholder="my-cool-project"
            />
          </Field>
          <Field label="Type" required>
            <select
              aria-label="Project type"
              value={form.type}
              onChange={(e) => update('type', e.target.value as Project['type'])}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 rounded-md px-3 py-2 text-sm text-zinc-100 outline-none cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Title" required>
          <Input
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Cool Project"
          />
        </Field>

        <Field label="Description" required>
          <Textarea
            required
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="One or two sentences about what this project does."
            rows={3}
          />
        </Field>

        <Field label="Tags" hint="Press Enter or comma to add a tag.">
          <TagInput value={form.tags} onChange={(tags) => update('tags', tags)} placeholder="React, TypeScript…" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Git URL" required>
            <Input
              required
              type="url"
              value={form.gitUrl}
              onChange={(e) => update('gitUrl', e.target.value)}
              placeholder="https://github.com/..."
            />
          </Field>
          <Field label="Preview URL" hint="Optional live demo link.">
            <Input
              type="url"
              value={form.previewUrl}
              onChange={(e) => update('previewUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </Field>
        </div>

        <Field label="Period" hint="Free-form, e.g. “Jan 2025 – Present”.">
          <Input
            value={form.period}
            onChange={(e) => update('period', e.target.value)}
            placeholder="Jan 2025 – Present"
          />
        </Field>

        <Field label="Cover image" hint="PNG / JPG / WEBP. Max 5 MB.">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <ImageOff size={18} className="text-zinc-600" />
              )}
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md px-3 py-2 cursor-pointer transition-colors">
              <Upload size={14} />
              {imageFile ? 'Change image' : 'Choose image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickImage(e.target.files?.[0] ?? null)}
              />
            </label>
            {imagePreview && imageFile && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(form.image); // revert to current
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer bg-transparent border-none"
              >
                Cancel
              </button>
            )}
          </div>
        </Field>

        {/* Deep-dive fields */}
        <Field label="Case study" hint="Markdown body rendered on the public case-study page.">
          <Textarea
            value={form.caseStudy}
            onChange={(e) => update('caseStudy', e.target.value)}
            placeholder="# Problem...## Solution...## Results..."
            rows={6}
          />
        </Field>

        <Field label="Gallery" hint="Upload screenshots to Firebase Storage, or paste external URLs.">
          <div className="space-y-3">
            {/* Thumbnail grid */}
            {form.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {form.gallery.map((url, i) => (
                  <div
                    key={url}
                    className="relative group aspect-video rounded-md overflow-hidden border border-zinc-800 bg-zinc-900"
                  >
                    <img src={url} alt={`gallery ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryAt(i)}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload + URL controls */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md px-3 py-2 cursor-pointer transition-colors">
                <Upload size={14} />
                {galleryUploading ? 'Uploading…' : 'Upload images'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={galleryUploading}
                  onChange={(e) => {
                    uploadGalleryFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>

              <div className="flex items-center gap-1 flex-1 min-w-[240px]">
                <Link2 size={14} className="text-zinc-500 shrink-0" />
                <Input
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addGalleryByUrl();
                    }
                  }}
                  placeholder="https://external-image-url.png"
                />
                <Button type="button" variant="secondary" onClick={addGalleryByUrl}>
                  Add
                </Button>
              </div>
            </div>

            {!form.id.trim() && (
              <p className="text-[11px] text-amber-500/80">
                Set a project id above before uploading gallery images.
              </p>
            )}
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Problem" hint="One-sentence challenge.">
            <Input
              value={form.problem}
              onChange={(e) => update('problem', e.target.value)}
              placeholder="Users needed real-time delivery tracking..."
            />
          </Field>
          <Field label="Architecture" hint="Key stack / design choice.">
            <Input
              value={form.architecture}
              onChange={(e) => update('architecture', e.target.value)}
              placeholder="React Native + Firebase + Expo..."
            />
          </Field>
          <Field label="Outcome" hint="Impact / metric.">
            <Input
              value={form.outcome}
              onChange={(e) => update('outcome', e.target.value)}
              placeholder="Reduced delivery time by 30%..."
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
            {isEdit ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
