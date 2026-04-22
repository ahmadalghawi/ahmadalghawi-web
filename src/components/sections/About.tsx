import { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, FileCode, Minus, Square, X, PanelRight, PanelBottom, IdCard, ExternalLink } from 'lucide-react';
import { COMMANDS, LINE_DELAY_MS } from '../../data/terminalCommands';

// Lazy-load the 3D Lanyard — pulls in ~1MB of deps only when needed
const Lanyard = lazy(() => import('../Lanyard/Lanyard'));

type DockPos = 'bottom' | 'right';
type HistoryEntry = { id: number; cmd: string; output: string[]; visibleCount: number };

export default function About() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [minimized, setMinimized] = useState(false);
  const [dock, setDock] = useState<DockPos>('bottom');
  const [closed, setClosed] = useState(false);
  const entryIdRef = useRef(0);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smooth scroll to bottom helper
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
        prev.map(e =>
          e.id === last.id ? { ...e, visibleCount: e.visibleCount + 1 } : e
        )
      );
      scrollToBottom();
    }, LINE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [history, scrollToBottom]);

  const run = useCallback((raw: string, extraLines?: string[]) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'clear') { setHistory([]); return; }

    let output: string[];

    if (cmd === 'date') {
      output = [`Current date/time: ${new Date().toLocaleString('en-SE', { timeZone: 'Europe/Stockholm' })}`, 'Timezone: Europe/Stockholm (CET/CEST)'];
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
      output = fileMap[file] ?? [`cat: ${file}: No such file or directory`, `Available files: README.md, experience.json, skills.js, projects.tsx, contact.env, resume.pdf`];
    } else if (cmd.startsWith('cd ')) {
      const dest = cmd.slice(3).trim();
      const navMap: Record<string, string> = { about: '/', experience: '/experience', skills: '/skills', projects: '/projects', contact: '/contact' };
      if (navMap[dest]) {
        output = [`Navigating to ${dest}...`, `> open ${navMap[dest]}`];
        // navigate after short delay
        setTimeout(() => { window.location.href = navMap[dest]; }, 900);
      } else {
        output = [`cd: ${dest}: No such section`, 'Available: about, experience, skills, projects, contact'];
      }
    } else {
      output = extraLines ?? COMMANDS[cmd] ?? [`'${raw}' is not recognized as a command.`, 'Type "help" to see available commands.'];
    }

    const id = ++entryIdRef.current;
    setHistory(prev => [...prev, { id, cmd: raw, output, visibleCount: 0 }]);
    setCmdHistory(prev => [...prev, raw]);
    setHistIdx(-1);
  }, [cmdHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${dock === 'right' && !closed ? 'flex gap-6' : ''}`}
    >
      {/* Top row — README card + Lanyard card side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch">
        {/* README.md card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FileCode className="text-blue-400" size={24} />
            <span className="text-white text-xl font-bold">README.md</span>
          </div>
          <div className="text-green-400 space-y-4">
            <div>
              <span className="text-gray-500"># </span>
              <span className="text-cyan-400 text-2xl font-bold">Ahmad Al-Ghawi</span>
            </div>
            <div>
              <span className="text-gray-500">## </span>
              <span className="text-yellow-400 text-lg">Senior Full Stack &amp; AI Engineer</span>
            </div>
            <div className="text-gray-300 leading-relaxed font-mono text-sm">
              <span className="text-gray-500">```markdown</span>
              <div className="my-1">
                AI-driven Full Stack Engineer with 4+ years of experience<br />
                building high-performance, scalable web and mobile applications.<br />
                Specialized in React, Next.js, React Native, Node.js, TypeScript,<br />
                Firebase, and AI-assisted development workflows.
              </div>
              <span className="text-gray-500">```</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <div className="text-cyan-400 font-bold mb-2">🚀 Current Role</div>
                <div className="text-white text-sm">Senior Full Stack & AI Engineer</div>
                <div className="text-gray-400 text-xs mt-1">May 2025 – Present</div>
              </div>
              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <div className="text-cyan-400 font-bold mb-2">💼 Experience</div>
                <div className="text-white text-sm">4+ Years</div>
                <div className="text-gray-400 text-xs mt-1">Web &amp; Mobile Development</div>
              </div>
              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <div className="text-cyan-400 font-bold mb-2">📍 Location</div>
                <div className="text-white text-sm">Malmö, Sweden</div>
                <div className="text-gray-400 text-xs mt-1">073-742 14 90</div>
              </div>
              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <div className="text-cyan-400 font-bold mb-2">🌐 Languages</div>
                <div className="text-white text-sm">Arabic · English · Swedish</div>
                <div className="text-gray-400 text-xs mt-1">Native · Fluent · Basic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lanyard card — drag-to-swing 3D ID card + View CV CTA */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700 bg-gray-900/60">
            <IdCard className="text-cyan-400" size={16} />
            <span className="text-white text-xs font-bold tracking-wide">id-card.lanyard</span>
            <span className="ml-auto text-[10px] font-mono text-gray-500">click = CV · drag to swing</span>
          </div>

          {/* 3D canvas area */}
          <div className="flex-1 min-h-[360px] relative">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs font-mono">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>loading 3D scene…</span>
                  </div>
                </div>
              }
            >
              <Lanyard
                position={[0, 0, 20]}
                gravity={[0, -40, 0]}
                onCardClick={() => navigate('/cv')}
              />
            </Suspense>
          </div>

          {/* View CV CTA */}
          <Link
            to="/cv"
            className="group flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-700 bg-gray-900/80 hover:bg-cyan-500/10 transition-colors"
          >
            <div>
              <div className="text-white text-sm font-semibold group-hover:text-cyan-300 transition-colors">
                View Full CV
              </div>
              <div className="text-gray-500 text-[11px] font-mono">clean recruiter-ready layout</div>
            </div>
            <ExternalLink size={14} className="text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Interactive Windows CMD Terminal */}
      {!closed && (
        <div className={`bg-black rounded-lg border-2 border-gray-600 shadow-2xl flex flex-col ${dock === 'right' ? 'w-120 shrink-0 self-start' : 'w-full'}`}>
          {/* Title bar */}
          <div className="bg-blue-600 px-3 py-1.5 rounded-t-lg border-b border-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="text-white" size={14} />
              <span className="text-white text-xs font-semibold">Command Prompt — Interactive Resume</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Dock toggle */}
              <button
                onClick={() => setDock(d => d === 'bottom' ? 'right' : 'bottom')}
                title={dock === 'bottom' ? 'Dock right' : 'Dock bottom'}
                className="w-5 h-5 bg-gray-600 hover:bg-gray-500 rounded-sm flex items-center justify-center cursor-pointer border-none"
              >
                {dock === 'bottom'
                  ? <PanelRight size={11} className="text-white" />
                  : <PanelBottom size={11} className="text-white" />}
              </button>
              {/* Minimize */}
              <button
                onClick={() => setMinimized(m => !m)}
                title={minimized ? 'Restore' : 'Minimize'}
                className="w-5 h-5 bg-gray-300 hover:bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer border-none"
              >
                <Minus size={10} className="text-black" />
              </button>
              {/* Maximize (noop, just visual) */}
              <button title="Maximize" className="w-5 h-5 bg-gray-300 hover:bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer border-none">
                <Square size={9} className="text-black" />
              </button>
              {/* Close */}
              <button
                onClick={() => setClosed(true)}
                title="Close"
                className="w-5 h-5 bg-red-500 hover:bg-red-400 rounded-sm flex items-center justify-center cursor-pointer border-none"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          </div>

          {/* Collapsible body */}
          <AnimatePresence initial={false}>
            {!minimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {/* Terminal body */}
                <div className="relative">
                  <div className="scanlines absolute inset-0 z-10 pointer-events-none" />
                  <div
                    ref={termRef}
                    className="p-4 bg-black overflow-y-auto cursor-text relative terminal-body"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <div className="text-gray-300 font-mono text-sm mb-3">
                      <div className="text-white mb-1">Microsoft Windows [Version 10.0.19045.3570]</div>
                      <div className="text-white mb-2">(c) Microsoft Corporation. All rights reserved.</div>
                      <div className="text-gray-400 mb-1">Welcome to Ahmad's Interactive Resume Terminal!</div>
                      <div className="text-gray-400">Type "help" to see available commands or "resume" to view resume data.</div>
                    </div>
                    <div className="font-mono text-sm">
                      {history.length === 0 && (
                        <div className="text-gray-400 mb-2">
                          Try typing <span className="text-cyan-400">"help"</span> or <span className="text-cyan-400">"resume"</span>
                        </div>
                      )}
                      {history.map((entry) => {
                        const isAnimating = entry.visibleCount < entry.output.length;
                        return (
                          <div key={entry.id} className="mb-3">
                            {/* prompt + command */}
                            <div className="flex items-center gap-1">
                              <span className="text-green-400">C:\Users\Ahmad\Portfolio</span>
                              <span className="text-yellow-400">{'>'}</span>
                              <span className="text-white ml-1">{entry.cmd}</span>
                            </div>
                            {/* animated output lines */}
                            <div className="mt-1 space-y-0.5">
                              {entry.output.slice(0, entry.visibleCount).map((line, li) => (
                                <motion.div
                                  key={li}
                                  initial={{ opacity: 0, x: -4 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.12 }}
                                  className={`whitespace-pre font-mono text-xs leading-5 ${
                                    line.startsWith('  →') ? 'text-cyan-400' :
                                    line.match(/^[╔╚║╗╝═─┌└│┐┘┤├]/) ? 'text-green-300' :
                                    line.match(/^[A-Z ]+$/) && line.trim().length > 2 ? 'text-yellow-300 font-bold' :
                                    line.startsWith('  ►') ? 'text-cyan-300' :
                                    line.startsWith('  [') ? 'text-green-300' :
                                    line === '' ? 'h-2 block' :
                                    'text-gray-300'
                                  }`}
                                >
                                  {line || '\u00A0'}
                                </motion.div>
                              ))}
                              {/* blinking cursor while animating */}
                              {isAnimating && (
                                <span className="inline-block w-2 h-3.5 bg-green-400 cursor-blink align-middle ml-0.5" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {/* Input — only show when no entry is animating */}
                      {(history.length === 0 || history[history.length - 1].visibleCount >= history[history.length - 1].output.length) && (
                        <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-1">
                          <span className="text-green-400">C:\Users\Ahmad\Portfolio</span>
                          <span className="text-yellow-400">{'>'}</span>
                          <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            autoComplete="off"
                            spellCheck={false}
                            aria-label="Terminal command input"
                            className="flex-1 bg-transparent text-white outline-none ml-1 caret-green-400 border-none text-xs"
                            placeholder="type a command..."
                          />
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick commands hint */}
                <div className="text-gray-500 text-xs p-3 border-t border-gray-700 flex flex-wrap gap-2 items-center bg-gray-950">
                  <span>💡</span>
                  {['help', 'resume', 'skills', 'experience', 'projects', 'contact'].map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => run(cmd)}
                      className="text-blue-400 bg-gray-800 px-1.5 py-0.5 rounded hover:bg-gray-700 transition-colors cursor-pointer border-none font-mono"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Reopen button if closed */}
      {closed && (
        <button
          onClick={() => setClosed(false)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 font-mono border border-gray-700 rounded px-3 py-1.5 bg-gray-800 transition-colors cursor-pointer"
        >
          <Terminal size={12} /> Open Interactive Terminal
        </button>
      )}
    </motion.div>
  );
}
