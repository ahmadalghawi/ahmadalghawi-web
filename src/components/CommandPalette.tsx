import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export interface PaletteCommand {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  action: () => void;
}

interface Props {
  open: boolean;
  mode?: 'full' | 'files';
  commands: PaletteCommand[];
  onClose: () => void;
}

function PaletteInner({ mode, commands, onClose }: Omit<Props, 'open'>) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(c => {
      const hay = `${c.label} ${c.hint ?? ''} ${c.group ?? ''}`.toLowerCase();
      return q.split(/\s+/).every(token => hay.includes(token));
    });
  }, [query, commands]);

  const clampedActive = Math.min(active, Math.max(filtered.length - 1, 0));

  // Scroll active into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${clampedActive}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [clampedActive]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[clampedActive];
      if (cmd) { cmd.action(); onClose(); }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-100 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-terminal"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.14 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden font-mono"
      >
        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-700">
          <ChevronRight size={14} className="text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder={mode === 'files' ? 'Go to file...' : 'Type a command or search...'}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
            aria-label="Command palette"
            autoFocus
          />
          <kbd className="text-[10px] text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">esc</kbd>
        </div>

        {/* List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500 text-xs">No matching commands</div>
          )}
          {filtered.map((c, i) => {
            const isActive = i === clampedActive;
            return (
              <div
                key={c.id}
                data-idx={i}
                onMouseEnter={() => setActive(i)}
                onClick={() => { c.action(); onClose(); }}
                className={`flex items-center justify-between gap-3 px-4 py-1.5 cursor-pointer text-xs ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {c.group && (
                    <span className={`shrink-0 text-[10px] uppercase tracking-wide ${isActive ? 'text-blue-200' : 'text-gray-500'}`}>
                      {c.group}
                    </span>
                  )}
                  <span className="truncate">{c.label}</span>
                </div>
                {c.hint && (
                  <span className={`shrink-0 text-[10px] ${isActive ? 'text-blue-200' : 'text-gray-500'}`}>
                    {c.hint}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-gray-500 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-gray-700 px-1 rounded">↑↓</kbd> navigate</span>
            <span><kbd className="bg-gray-700 px-1 rounded">↵</kbd> select</span>
            <span><kbd className="bg-gray-700 px-1 rounded">esc</kbd> close</span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CommandPalette({ open, mode = 'full', commands, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && <PaletteInner mode={mode} commands={commands} onClose={onClose} />}
    </AnimatePresence>
  );
}
