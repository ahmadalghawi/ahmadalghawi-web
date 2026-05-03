/**
 * AdminBlogEditor — split-pane Markdown editor with live preview,
 * Firebase Storage image uploads, and post metadata form.
 */
import { useEffect, useState, useCallback, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Upload, ImageIcon, Eye, FileEdit } from 'lucide-react';
import { createPost, upsertPost } from '../../lib/repositories/posts';
import { uploadAtPath, deleteByPath } from '../../lib/storage';
import type { Post } from '../../lib/types';
import {
  Button,
  Field,
  Input,
  Textarea,
  TagInput,
  Modal,
} from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';

interface FormState {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImagePath: string;
  tags: string[];
  published: boolean;
  featured: boolean;
}

const emptyForm: FormState = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  coverImagePath: '',
  tags: [],
  published: false,
  featured: false,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 64);
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function AdminBlogEditor({
  open,
  initial,
  onClose,
  onSaved,
  existingSlugs,
}: {
  open: boolean;
  initial: Post | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  existingSlugs: Set<string>;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [previewTab, setPreviewTab] = useState<'write' | 'preview' | 'split'>('split');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        id: initial.id,
        slug: initial.slug,
        title: initial.title,
        excerpt: initial.excerpt,
        content: initial.content,
        coverImage: initial.coverImage ?? '',
        coverImagePath: initial.coverImagePath ?? '',
        tags: [...initial.tags],
        published: initial.published,
        featured: initial.featured,
      });
      setImagePreview(initial.coverImage ?? '');
    } else {
      setForm(emptyForm);
      setImagePreview('');
    }
    setImageFile(null);
    setError(null);
    setPreviewTab('split');
  }, [open, initial]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(title: string) {
    update('title', title);
    if (!isEdit && (form.slug === '' || form.slug === slugify(form.title))) {
      update('slug', slugify(title));
    }
  }

  function pickCover(file: File | null) {
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

  const insertImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        pushToast('error', 'Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        pushToast('error', 'Image too large (max 5 MB)');
        return;
      }
      const path = `blog/${form.slug || 'draft'}/${Date.now()}.${file.name.split('.').pop()}`;
      setUploadingImage(true);
      try {
        const { url } = await uploadAtPath(path, file, 5 * 1024 * 1024);
        const markdown = `\n![${file.name}](${url})\n`;
        update('content', form.content + markdown);
        pushToast('success', 'Image inserted into editor');
      } catch (err) {
        pushToast('error', (err as Error).message);
      } finally {
        setUploadingImage(false);
      }
    },
    [form.slug, form.content]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.slug.trim()) return setError('Slug is required');
    if (!form.title.trim()) return setError('Title is required');
    if (!form.excerpt.trim()) return setError('Excerpt is required');
    if (!form.content.trim()) return setError('Content is required');
    if (!isEdit && existingSlugs.has(form.slug)) {
      return setError(`A post with slug "${form.slug}" already exists`);
    }

    setSubmitting(true);
    try {
      let coverImage = form.coverImage;
      let coverImagePath = form.coverImagePath;

      if (imageFile) {
        const path = `blog/${form.slug}/cover.${imageFile.name.split('.').pop()}`;
        const uploaded = await uploadAtPath(path, imageFile, 5 * 1024 * 1024);
        if (coverImagePath && coverImagePath !== uploaded.path) {
          await deleteByPath(coverImagePath).catch(() => {});
        }
        coverImage = uploaded.url;
        coverImagePath = uploaded.path;
      }

      const payload: Post = {
        id: form.id || crypto.randomUUID(),
        slug: form.slug.trim(),
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        coverImage: coverImage || undefined,
        coverImagePath: coverImagePath || undefined,
        tags: form.tags,
        published: form.published,
        featured: form.featured,
        readingTime: estimateReadingTime(form.content),
      };

      if (isEdit) {
        await upsertPost(payload);
        pushToast('success', `Saved "${payload.title}"`);
      } else {
        await createPost(payload);
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
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit post' : 'New post'} maxWidth="max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Metadata row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Slug" required hint="URL-safe identifier. Used in /blog/{slug}">
            <Input
              required
              value={form.slug}
              onChange={(e) => update('slug', slugify(e.target.value))}
              placeholder="my-first-post"
            />
          </Field>
          <Field label="Title" required>
            <Input
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My First Post"
            />
          </Field>
        </div>

        <Field label="Excerpt" required hint="Short summary shown in post cards and SEO meta.">
          <Textarea
            required
            value={form.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            placeholder="A brief summary of what this article covers..."
            rows={2}
          />
        </Field>

        <Field label="Tags" hint="Press Enter or comma to add a tag.">
          <TagInput value={form.tags} onChange={(tags) => update('tags', tags)} placeholder="React, Firebase, SEO…" />
        </Field>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update('published', e.target.checked)}
              className="accent-cyan-500 w-4 h-4"
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              className="accent-amber-500 w-4 h-4"
            />
            Featured
          </label>
        </div>

        {/* Cover image */}
        <Field label="Cover image" hint="PNG / JPG / WEBP. Max 5 MB.">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="cover preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={18} className="text-zinc-600" />
              )}
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md px-3 py-2 cursor-pointer transition-colors">
              <Upload size={14} />
              {imageFile ? 'Change cover' : 'Choose cover'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickCover(e.target.files?.[0] ?? null)}
              />
            </label>
            {imagePreview && imageFile && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(form.coverImage);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer bg-transparent border-none"
              >
                Cancel
              </button>
            )}
          </div>
        </Field>

        {/* Editor tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => setPreviewTab('write')}
            className={`text-xs px-2.5 py-1 rounded cursor-pointer border-none ${
              previewTab === 'write' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
            }`}
          >
            <FileEdit size={12} className="inline mr-1" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('preview')}
            className={`text-xs px-2.5 py-1 rounded cursor-pointer border-none ${
              previewTab === 'preview' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
            }`}
          >
            <Eye size={12} className="inline mr-1" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('split')}
            className={`text-xs px-2.5 py-1 rounded cursor-pointer border-none ${
              previewTab === 'split' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
            }`}
          >
            Split
          </button>
          <div className="flex-1" />
          <label className="inline-flex items-center gap-2 text-xs text-zinc-300 hover:text-zinc-100 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md px-3 py-1.5 cursor-pointer transition-colors">
            <Upload size={12} />
            {uploadingImage ? 'Uploading…' : 'Insert image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingImage}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) insertImage(file);
                e.target.value = '';
              }}
            />
          </label>
        </div>

        {/* Editor / Preview pane */}
        <div
          className={`grid gap-4 ${
            previewTab === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {(previewTab === 'write' || previewTab === 'split') && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-300">Markdown</label>
              <Textarea
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                placeholder="# Heading&#10;&#10;Write your article in Markdown..."
                rows={18}
                className="font-mono text-xs leading-relaxed"
              />
              <div className="text-[10px] text-zinc-600 flex justify-between">
                <span>Supports GitHub-flavored Markdown</span>
                <span>{form.content.length} chars · ~{estimateReadingTime(form.content)} min read</span>
              </div>
            </div>
          )}

          {(previewTab === 'preview' || previewTab === 'split') && (
            <div className="flex flex-col gap-1 min-h-0">
              <label className="text-xs font-medium text-zinc-300">Preview</label>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md p-4 overflow-y-auto max-h-[480px] min-h-[200px]">
                <article className="prose prose-sm prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800">
                  {form.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {form.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-zinc-600 text-sm italic">Preview will appear here…</p>
                  )}
                </article>
              </div>
            </div>
          )}
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
            {isEdit ? 'Save changes' : 'Create post'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
