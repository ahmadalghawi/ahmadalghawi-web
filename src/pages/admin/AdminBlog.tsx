/**
 * AdminBlog — list + create / edit / delete / publish blog posts.
 */
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, FileText } from 'lucide-react';
import {
  getAllPosts,
  deletePost,
  publishPost,
} from '../../lib/repositories/posts';
import { deleteByPath } from '../../lib/storage';
import { invalidateCache } from '../../lib/cache';
import type { Post } from '../../lib/types';
import {
  Button,
  PageHeader,
  LoadingState,
  EmptyState,
  ConfirmDialog,
} from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';
import AdminBlogEditor from './AdminBlogEditor';

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);

  async function refresh() {
    const fresh = await getAllPosts();
    setPosts(fresh);
    invalidateCache('posts');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch((err) => {
      pushToast('error', `Failed to load posts: ${(err as Error).message}`);
    });
  }, []);

  async function handleDelete(p: Post) {
    try {
      await deletePost(p.id);
      if (p.coverImagePath) await deleteByPath(p.coverImagePath).catch(() => {});
      pushToast('success', `Deleted "${p.title}"`);
      setConfirmDelete(null);
      await refresh();
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  }

  async function togglePublish(p: Post) {
    try {
      await publishPost(p.id, !p.published);
      pushToast('success', `${!p.published ? 'Published' : 'Unpublished'} "${p.title}"`);
      await refresh();
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  }

  const draftCount = posts?.filter((p) => !p.published).length ?? 0;
  const publishedCount = posts?.filter((p) => p.published).length ?? 0;

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Blog Posts"
        description={`${publishedCount} published · ${draftCount} draft${draftCount === 1 ? '' : 's'}. Manage articles written in Markdown with Firebase Storage image support.`}
        actions={
          <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
            New post
          </Button>
        }
      />

      {posts === null ? (
        <LoadingState />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          hint="Create your first blog post to get started."
          action={
            <Button icon={<Plus size={14} />} onClick={() => setCreating(true)}>
              New post
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li
              key={p.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex items-center gap-4 hover:border-zinc-700 transition-colors"
            >
              {/* Cover */}
              <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                {p.coverImage ? (
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <FileText size={16} className="text-zinc-600" />
                )}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100 truncate">{p.title}</span>
                  {p.featured && (
                    <span className="text-[10px] uppercase tracking-wide text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 flex items-center gap-1">
                      <Star size={10} /> Featured
                    </span>
                  )}
                  <span
                    className={`text-[10px] uppercase tracking-wide rounded px-1.5 py-0.5 border ${
                      p.published
                        ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
                    }`}
                  >
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{p.excerpt}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600 font-mono">
                  <span>slug: {p.slug}</span>
                  {p.tags.length > 0 && <span>· {p.tags.join(', ')}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish(p)}
                  aria-label={p.published ? 'Unpublish' : 'Publish'}
                  title={p.published ? 'Unpublish' : 'Publish'}
                  className={`p-1.5 cursor-pointer bg-transparent border-none ${
                    p.published ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
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

      {/* Editor modal */}
      <AdminBlogEditor
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
        existingSlugs={new Set((posts ?? []).map((p) => p.slug))}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.title}"?`}
        message="This permanently removes the post and its cover image. This cannot be undone."
        confirmLabel="Delete post"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete); }}
      />
    </div>
  );
}
