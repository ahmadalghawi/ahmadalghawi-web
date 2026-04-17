import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';
import { COMMANDS, LINE_DELAY_MS } from '../data/terminalCommands';

type HistoryEntry = { id: number; cmd: string; output: string[]; visibleCount: number };

/**
 * Full-size terminal for use in the main content area.
 * Renders a title bar + large scrollable body + input.
 * Reuses COMMANDS from data/terminalCommands.ts.
 */
export default function FullTerminal() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 0,
      cmd: '',
      output: [
        'Microsoft Windows [Version 10.0.19045.3570]',
        '(c) Microsoft Corporation. All rights reserved.',
        '',
        "Welcome to Ahmad's Interactive Resume Terminal!",
        'Type "help" to see available commands or "resume" to view resume data.',
        '',
      ],
      visibleCount: 6,
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const entryIdRef = useRef(0);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = termRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  // Animate visible lines for newest entry
  useEffect(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (last.visibleCount >= last.output.length) {
      scrollToBottom();
      return;
    }
    const timer = setTimeout(() => {
      setHistory(prev =>
        prev.map(e => (e.id === last.id ? { ...e, visibleCount: e.visibleCount + 1 } : e))
      );
      scrollToBottom();
    }, LINE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [history, scrollToBottom]);

  const run = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'clear') { setHistory([]); return; }

    let output: string[];
    if (cmd === 'date') {
      output = [
        `Current date/time: ${new Date().toLocaleString('en-SE', { timeZone: 'Europe/Stockholm' })}`,
        'Timezone: Europe/Stockholm (CET/CEST)',
      ];
    } else if (cmd === 'history') {
      output = cmdHistory.length === 0
        ? ['No commands in history yet.']
        : ['Command history:', '', ...cmdHistory.map((c, i) => `  ${i + 1}  ${c}`)];
    } else if (cmd.startsWith('echo ')) {
      output = [raw.slice(5)];
    } else if (cmd.startsWith('cat ')) {
      const file = cmd.slice(4).trim();
      const fileMap: Record<string, string[]> = {
        'readme.md': COMMANDS.whoami,
        'experience.json': COMMANDS.experience,
        'skills.js': COMMANDS.skills,
        'projects.tsx': COMMANDS.projects,
        'contact.env': COMMANDS.contact,
        'resume.pdf': COMMANDS.resume,
      };
      output = fileMap[file] ?? [
        `cat: ${file}: No such file or directory`,
        'Available files: README.md, experience.json, skills.js, projects.tsx, contact.env, resume.pdf',
      ];
    } else if (cmd.startsWith('cd ')) {
      const dest = cmd.slice(3).trim();
      const navMap: Record<string, string> = {
        about: '/', experience: '/experience', skills: '/skills', projects: '/projects', contact: '/contact',
      };
      if (navMap[dest]) {
        output = [`Navigating to ${dest}...`, `> open ${navMap[dest]}`];
        setTimeout(() => navigate(navMap[dest]), 600);
      } else {
        output = [
          `cd: ${dest}: No such section`,
          'Available: about, experience, skills, projects, contact',
        ];
      }
    } else {
      output = COMMANDS[cmd] ?? [
        `'${raw}' is not recognized as a command.`,
        'Type "help" to see available commands.',
      ];
    }

    const id = ++entryIdRef.current;
    setHistory(prev => [...prev, { id, cmd: raw, output, visibleCount: 0 }]);
    setCmdHistory(prev => [...prev, raw]);
    setHistIdx(-1);
  }, [cmdHistory, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < 0) return;
      const next = histIdx + 1;
      if (next >= cmdHistory.length) { setHistIdx(-1); setInput(''); }
      else { setHistIdx(next); setInput(cmdHistory[next]); }
    }
  };

  const lastEntry = history[history.length - 1];
  const isAnimating = lastEntry && lastEntry.visibleCount < lastEntry.output.length;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="bg-black rounded-lg border-2 border-gray-600 shadow-2xl flex flex-col cursor-text"
    >
      {/* Title bar */}
      <div className="bg-blue-600 px-3 py-1.5 rounded-t-lg border-b border-gray-600 flex items-center gap-2">
        <TerminalIcon className="text-white" size={14} />
        <span className="text-white text-xs font-semibold">Command Prompt — Interactive Resume</span>
      </div>

      {/* Body */}
      <div
        ref={termRef}
        className="p-4 overflow-y-auto font-mono text-xs space-y-2"
        style={{ minHeight: 360, maxHeight: 520 }}
      >
        {history.map(entry => (
          <div key={entry.id}>
            {entry.cmd && (
              <div className="text-gray-400">
                <span className="text-green-400">C:\Users\Ahmad\Portfolio</span>
                <span className="text-yellow-400">{'>'}</span> {entry.cmd}
              </div>
            )}
            {entry.output.slice(0, entry.visibleCount).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.12 }}
                className="text-gray-300 whitespace-pre-wrap"
              >
                {line}
              </motion.div>
            ))}
          </div>
        ))}

        {/* Prompt */}
        {!isAnimating && (
          <form onSubmit={onSubmit} className="flex items-center text-xs">
            <span className="text-green-400">C:\Users\Ahmad\Portfolio</span>
            <span className="text-yellow-400">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              spellCheck={false}
              aria-label="Full terminal input"
              placeholder="type a command..."
              className="flex-1 bg-transparent text-white outline-none ml-1 caret-green-400 border-none text-xs"
              autoFocus
            />
          </form>
        )}

        {isAnimating && (
          <span className="inline-block w-2 h-3 bg-green-400 animate-pulse" />
        )}
      </div>

      {/* Quick commands hint */}
      <div className="text-gray-500 text-xs p-3 border-t border-gray-700 flex flex-wrap gap-2 items-center bg-gray-950">
        <span>💡</span>
        {['help', 'resume', 'skills', 'experience', 'projects', 'contact'].map(c => (
          <button
            key={c}
            onClick={(e) => { e.stopPropagation(); run(c); }}
            className="px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded border border-gray-700 cursor-pointer transition-colors font-mono"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
