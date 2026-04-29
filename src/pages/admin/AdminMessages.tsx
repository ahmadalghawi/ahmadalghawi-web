/**
 * AdminMessages — contact form inbox.
 *
 * Lists messages newest-first with mark-read / delete actions.
 * Uses fresh fetch (no SWR cache) so unread state is accurate.
 */
import { useEffect, useState, useCallback } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  User,
  Clock,
  Globe,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getAllMessages, markRead, deleteMessage } from '../../lib/repositories/messages';
import { pushToast } from '../../components/admin/toast-utils';
import { ConfirmDialog } from '../../components/admin/ui';
import type { Message } from '../../lib/types';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Message | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(msg: Message) {
    setBusyId(msg.id);
    try {
      await markRead(msg.id, !msg.read);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
    } catch (err) {
      pushToast('error', (err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setConfirmDelete(null);
      pushToast('success', 'Message deleted');
    } catch (err) {
      pushToast('error', (err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8 max-w-5xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {unread === 0
              ? 'No unread messages'
              : `${unread} unread of ${messages.length}`}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-3 py-2 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Clock size={13} />}
          Refresh
        </button>
      </header>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {messages.length === 0 && !loading && !error && (
        <div className="text-center py-20 text-zinc-500 text-sm">
          <MailOpen size={32} className="mx-auto mb-3 opacity-50" />
          <p>No messages yet.</p>
          <p className="text-xs mt-1 text-zinc-600">
            Submissions from the public contact form will appear here.
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`relative border rounded-xl p-4 transition-colors ${
              msg.read
                ? 'bg-zinc-900/30 border-zinc-800/60'
                : 'bg-zinc-900/60 border-cyan-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleRead(msg)}
                disabled={busyId === msg.id}
                title={msg.read ? 'Mark unread' : 'Mark read'}
                className="shrink-0 mt-0.5 p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-none disabled:opacity-40"
              >
                {busyId === msg.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : msg.read ? (
                  <MailOpen size={14} />
                ) : (
                  <Mail size={14} className="text-cyan-300" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-zinc-200 flex items-center gap-1.5">
                    <User size={12} className="text-zinc-500" />
                    {msg.name}
                  </span>
                  <span className="text-xs text-zinc-500">&lt;{msg.email}&gt;</span>
                  {!msg.read && (
                    <span className="text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>

                {msg.subject && (
                  <div className="text-xs text-zinc-400 mt-1">{msg.subject}</div>
                )}

                <p className="text-sm text-zinc-300 mt-2 whitespace-pre-wrap">{msg.body}</p>

                <div className="flex items-center gap-3 mt-3 text-[11px] text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '—'}
                  </span>
                  {msg.userAgent && (
                    <span className="flex items-center gap-1 truncate max-w-[300px]">
                      <Globe size={10} />
                      {msg.userAgent}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setConfirmDelete(msg)}
                disabled={busyId === msg.id}
                title="Delete"
                className="shrink-0 p-1.5 rounded-md hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none disabled:opacity-40"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete message?"
        message={
          confirmDelete
            ? `Permanently remove the message from ${confirmDelete.name}. This cannot be undone.`
            : ''
        }
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete.id); }}
      />
    </div>
  );
}
