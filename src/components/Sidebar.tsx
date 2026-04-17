import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode, Database, Code, Monitor, Mail, Terminal as TerminalIcon, Folder,
  Check, RefreshCw, Plus, Search, FileText, Quote, Sparkles, Package, Loader2,
  Trash2, SquareSplitHorizontal,
} from 'lucide-react';

export type SectionId = 'about' | 'experience' | 'skills' | 'projects' | 'contact';
export type PanelId = 'explorer' | 'git' | 'ext' | 'terminal';

interface FileItem {
  id: SectionId;
  path: string;
  name: string;
  icon: React.ElementType;
  extension: string;
}

const files: FileItem[] = [
  { id: 'about',      path: '/',           name: 'README',     icon: FileCode, extension: '.md'  },
  { id: 'experience', path: '/experience', name: 'experience', icon: Database, extension: '.json'},
  { id: 'skills',     path: '/skills',     name: 'skills',     icon: Code,     extension: '.js'  },
  { id: 'projects',   path: '/projects',   name: 'projects',   icon: Monitor,  extension: '.tsx' },
  { id: 'contact',    path: '/contact',    name: 'contact',    icon: Mail,     extension: '.env' },
];

const PANEL_TITLES: Record<PanelId, string> = {
  explorer: 'EXPLORER',
  git:      'SOURCE CONTROL',
  ext:      'EXTENSIONS',
  terminal: 'TERMINAL',
};

interface SidebarProps {
  activeSection: SectionId;
  activePanel: PanelId;
}

export default function Sidebar({ activeSection, activePanel }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-gray-800 border-r border-gray-700 flex flex-col shrink-0 overflow-hidden">
      {/* Header — traffic lights + whoami */}
      <div className="bg-gray-900 p-4 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400 text-sm ml-2">portfolio.dev</span>
        </div>
        <div className="text-green-400 text-sm">
          <span className="text-cyan-400">$</span> whoami
        </div>
        <div className="text-white text-sm">
          <TypeAnimation
            sequence={['ahmad-alghawi - Full Stack Developer', 1000]}
            wrapper="span"
            cursor={false}
            repeat={0}
          />
        </div>
      </div>

      {/* Panel title */}
      <div className="px-4 pt-3 pb-2 text-xs font-bold tracking-wide text-gray-400 shrink-0">
        {PANEL_TITLES[activePanel]}
      </div>

      {/* Panel content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {activePanel === 'explorer' && <ExplorerPanel activeSection={activeSection} />}
        {activePanel === 'git'      && <GitPanel activeSection={activeSection} />}
        {activePanel === 'ext'      && <ExtPanel />}
        {activePanel === 'terminal' && <TerminalPanel />}
      </div>
    </div>
  );
}

/* ──────────────── Explorer panel ──────────────── */
function ExplorerPanel({ activeSection }: { activeSection: SectionId }) {
  const navigate = useNavigate();
  const activeFile = files.find(f => f.id === activeSection);
  return (
    <div className="px-3 pb-4 flex-1 overflow-y-auto">
      <div className="flex items-center gap-2 mb-3 text-gray-300">
        <Folder className="text-blue-400" size={14} />
        <span className="text-xs">portfolio-main/</span>
      </div>

      <div className="space-y-1 text-sm">
        {files.map((file) => {
          const Icon = file.icon;
          const isActive = activeSection === file.id;
          return (
            <div
              key={file.id}
              onClick={() => navigate(file.path)}
              className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-gray-700 text-cyan-400 border-l-2 border-cyan-400'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white border-l-2 border-transparent'
              }`}
            >
              <Icon size={14} />
              <span className="text-sm">
                {file.name}
                <span className={`text-xs ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{file.extension}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* git status summary */}
      <div className="mt-5 bg-gray-900 p-3 rounded border border-gray-700 text-xs">
        <div className="text-green-400 mb-1">
          <span className="text-cyan-400">$</span> git status
        </div>
        <div className="text-gray-400">
          On branch <span className="text-green-400">main</span>
        </div>
        <div className="text-gray-400">
          Modified: <span className="text-yellow-400">{activeFile?.name}{activeFile?.extension}</span>
        </div>
      </div>

      {/* cd link */}
      <div className="mt-5 pt-3 border-t border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm bg-transparent border-none cursor-pointer"
        >
          <TerminalIcon size={14} />
          <span>cd ../main-site</span>
        </button>
      </div>
    </div>
  );
}

/* ──────────────── Source Control panel (commit UI) ──────────────── */
function GitPanel({ activeSection }: { activeSection: SectionId }) {
  const activeFile = files.find(f => f.id === activeSection);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'committing' | 'pushing' | 'done'>('idle');

  const changes = [
    { flag: 'M', color: 'text-yellow-400', label: `${activeFile?.name}${activeFile?.extension}`, note: 'Modified' },
    { flag: 'M', color: 'text-yellow-400', label: 'App.tsx',        note: 'Modified' },
    { flag: 'A', color: 'text-green-400',  label: 'CommandPalette.tsx', note: 'Added'    },
    { flag: 'A', color: 'text-green-400',  label: 'GitHubStats.tsx',    note: 'Added'    },
    { flag: '?', color: 'text-gray-500',   label: 'ProblemsPanel.tsx',  note: 'Untracked'},
  ];

  const doCommit = () => {
    if (!message.trim()) return;
    setStatus('committing');
    setTimeout(() => setStatus('pushing'), 800);
    setTimeout(() => {
      setStatus('done');
      setMessage('');
    }, 1800);
    setTimeout(() => setStatus('idle'), 3800);
  };

  return (
    <div className="px-3 pb-4 flex-1 overflow-y-auto space-y-3 text-xs">
      {/* Commit message + action */}
      <div className="space-y-2">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={status !== 'idle'}
          placeholder="Message (press Ctrl+Enter to commit on 'main')"
          rows={3}
          aria-label="Commit message"
          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white placeholder-gray-600 outline-none focus:border-cyan-400 transition-colors font-mono text-xs resize-none disabled:opacity-50"
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') doCommit(); }}
        />
        <button
          onClick={doCommit}
          disabled={status !== 'idle' || !message.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-1.5 rounded font-mono text-xs cursor-pointer border-none transition-colors"
        >
          {status === 'idle'       && <><Check size={12} /> Commit</>}
          {status === 'committing' && <><Loader2 size={12} className="animate-spin" /> Committing…</>}
          {status === 'pushing'    && <><Loader2 size={12} className="animate-spin" /> Pushing to origin…</>}
          {status === 'done'       && <><Check size={12} /> Pushed ✓</>}
        </button>
        <button
          onClick={() => { /* noop fetch */ }}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 rounded font-mono text-xs cursor-pointer border border-gray-700 transition-colors"
        >
          <RefreshCw size={12} /> Sync Changes
        </button>
      </div>

      {/* Changes list */}
      <div>
        <div className="flex items-center justify-between px-1 mb-1 text-gray-400">
          <span className="uppercase tracking-wide font-bold text-[10px]">Changes</span>
          <span className="bg-gray-700 text-gray-300 px-1.5 rounded text-[10px]">{changes.length}</span>
        </div>
        <div className="space-y-0.5">
          {changes.map((c, i) => (
            <div
              key={i}
              title={c.note}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700/50 cursor-default"
            >
              <FileText size={12} className="text-gray-500 shrink-0" />
              <span className="text-gray-300 truncate flex-1">{c.label}</span>
              <span className={`${c.color} font-bold shrink-0`}>{c.flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status toast */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded border p-2 font-mono text-[11px] ${
              status === 'done'
                ? 'bg-green-900/30 border-green-500/50 text-green-300'
                : 'bg-blue-900/30 border-blue-500/50 text-blue-300'
            }`}
          >
            {status === 'committing' && 'Running pre-commit hooks...'}
            {status === 'pushing'    && 'Pushing 1 commit to origin/main'}
            {status === 'done'       && '✓ Everything up-to-date'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────── Extensions panel (marketplace list) ──────────────── */
function ExtPanel() {
  const [query, setQuery] = useState('');

  const extensions = [
    { id: 'now',   icon: Sparkles, color: 'text-yellow-400', name: 'now.md',             author: 'ahmad-alghawi', desc: 'Current focus, what I\'m building/learning', version: '1.2.0',  downloads: '∞' },
    { id: 'rec',   icon: Quote,    color: 'text-purple-400', name: 'recommendations.md', author: 'ahmad-alghawi', desc: 'Testimonials from teammates and clients',    version: '2.0.0',  downloads: '∞' },
    { id: 'stack', icon: Package,  color: 'text-cyan-400',   name: 'tech-stack.json',    author: 'ahmad-alghawi', desc: 'Full tech-stack breakdown by category',      version: '1.0.1',  downloads: '∞' },
  ];

  const filtered = extensions.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="px-3 pb-4 flex-1 overflow-y-auto space-y-3 text-xs">
      {/* Search input */}
      <div className="relative">
        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Extensions in Marketplace"
          aria-label="Search extensions"
          className="w-full bg-gray-900 border border-gray-700 rounded pl-7 pr-2 py-1.5 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition-colors font-mono text-xs"
        />
      </div>

      {/* Installed section */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2 text-gray-400">
          <span className="uppercase tracking-wide font-bold text-[10px]">Installed</span>
          <span className="bg-gray-700 text-gray-300 px-1.5 rounded text-[10px]">{filtered.length}</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-gray-500 text-center py-4">No matching extensions</div>
        )}

        <div className="space-y-2">
          {filtered.map(ext => {
            const Icon = ext.icon;
            return (
              <div
                key={ext.id}
                className="bg-gray-900 border border-gray-700 rounded p-2.5 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded bg-gray-800 flex items-center justify-center shrink-0 ${ext.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold truncate">{ext.name}</span>
                      <span className="text-gray-500 text-[10px] shrink-0">v{ext.version}</span>
                    </div>
                    <div className="text-gray-400 text-[11px] leading-tight mt-0.5 line-clamp-2">{ext.desc}</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
                      <span>{ext.author}</span>
                      <span>·</span>
                      <span>⬇ {ext.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="pt-3 border-t border-gray-700 text-gray-500 text-[10px] leading-relaxed">
        💡 These extensions render in the main editor area →
      </div>
    </div>
  );
}

/* ──────────────── Terminal panel (sessions list) ──────────────── */
function TerminalPanel() {
  const [terminals, setTerminals] = useState([
    { id: 1, name: 'pwsh',  active: true  },
    { id: 2, name: 'bash',  active: false },
    { id: 3, name: 'node',  active: false },
  ]);
  const [nextId, setNextId] = useState(4);

  const activate = (id: number) => {
    setTerminals(ts => ts.map(t => ({ ...t, active: t.id === id })));
  };
  const addTerminal = () => {
    const shells = ['pwsh', 'bash', 'zsh', 'node', 'python'];
    const name = shells[nextId % shells.length];
    setTerminals(ts => [...ts.map(t => ({ ...t, active: false })), { id: nextId, name, active: true }]);
    setNextId(n => n + 1);
  };
  const killTerminal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTerminals(ts => {
      if (ts.length <= 1) return ts;
      const filtered = ts.filter(t => t.id !== id);
      // Ensure at least one active
      if (!filtered.some(t => t.active)) filtered[0].active = true;
      return filtered;
    });
  };

  return (
    <div className="px-3 pb-4 flex-1 overflow-y-auto space-y-3 text-xs">
      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={addTerminal}
          title="New terminal"
          className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 rounded font-mono cursor-pointer border border-gray-700 transition-colors"
        >
          <Plus size={12} /> New
        </button>
        <button
          title="Split terminal"
          className="flex items-center justify-center w-8 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded cursor-pointer border border-gray-700 transition-colors"
        >
          <SquareSplitHorizontal size={12} />
        </button>
      </div>

      {/* Sessions list */}
      <div>
        <div className="flex items-center justify-between px-1 mb-1 text-gray-400">
          <span className="uppercase tracking-wide font-bold text-[10px]">Terminals</span>
          <span className="bg-gray-700 text-gray-300 px-1.5 rounded text-[10px]">{terminals.length}</span>
        </div>

        <div className="space-y-0.5">
          {terminals.map(t => (
            <div
              key={t.id}
              onClick={() => activate(t.id)}
              className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors border-l-2 ${
                t.active
                  ? 'bg-gray-700 border-cyan-400 text-white'
                  : 'border-transparent text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <TerminalIcon size={12} className={t.active ? 'text-cyan-400' : 'text-gray-500'} />
              <span className="flex-1 truncate font-mono">{t.name}</span>
              <span className="text-gray-500 text-[10px]">{t.id}</span>
              {terminals.length > 1 && (
                <button
                  onClick={(e) => killTerminal(t.id, e)}
                  title="Kill terminal"
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 bg-transparent border-none cursor-pointer p-0"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shortcuts hint */}
      <div className="pt-3 border-t border-gray-700 space-y-1 text-gray-500 text-[10px] font-mono">
        <div className="text-gray-400 font-bold mb-1.5">Shortcuts</div>
        <div className="flex justify-between"><span>New terminal</span><kbd className="bg-gray-800 px-1 rounded">Ctrl+Shift+`</kbd></div>
        <div className="flex justify-between"><span>Clear</span><kbd className="bg-gray-800 px-1 rounded">clear</kbd></div>
        <div className="flex justify-between"><span>Help</span><kbd className="bg-gray-800 px-1 rounded">help</kbd></div>
      </div>
    </div>
  );
}
