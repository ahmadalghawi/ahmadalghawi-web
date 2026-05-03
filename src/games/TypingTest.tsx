import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Keyboard, Trophy, Timer } from 'lucide-react';

const SNIPPETS = [
  'const add = (a, b) => a + b;',
  'function greet(name) { return `Hello, ${name}!`; }',
  'const arr = [1, 2, 3].map(n => n * n);',
  'if (user && user.active) { console.log(user.name); }',
  'const sum = nums.reduce((a, b) => a + b, 0);',
  'export default function App() { return <div>Hello</div>; }',
  'for (let i = 0; i < 10; i++) { console.log(i); }',
  'const { data, error } = await api.fetch(url);',
  'type User = { id: string; name: string; email: string; };',
  'const filtered = items.filter(x => x.price > 10);',
];

function lk(k: string) { return `games.typing.${k}`; }

export default function TypingTest() {
  const [snippet, setSnippet] = useState<string>(() => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]);
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [best, setBest] = useState<number>(() => { try { return Number(localStorage.getItem(lk('bestWpm'))) || 0; } catch { return 0; } });
  const [now, setNow] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (startedAt !== null && finishedAt === null) {
      timerRef.current = window.setInterval(() => setNow(Date.now()), 100);
      return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
    }
  }, [startedAt, finishedAt]);

  const correct = useMemo(() => {
    let i = 0;
    while (i < input.length && i < snippet.length && input[i] === snippet[i]) i++;
    return i;
  }, [input, snippet]);

  const elapsed = startedAt !== null ? ((finishedAt ?? now) - startedAt) / 1000 : 0;
  const wpm = elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
  const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;
  const done = finishedAt !== null;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (done) return;
    if (startedAt === null) setStartedAt(Date.now());
    setInput(v);
    if (v === snippet) {
      const end = Date.now();
      setFinishedAt(end);
      const finalElapsed = (end - (startedAt ?? end)) / 1000 || 0.01;
      const finalWpm = Math.round((snippet.length / 5) / (finalElapsed / 60));
      if (finalWpm > best) {
        setBest(finalWpm);
        try { localStorage.setItem(lk('bestWpm'), String(finalWpm)); } catch { /* blocked */ }
      }
    }
  }

  function restart() {
    setSnippet(SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]);
    setInput('');
    setStartedAt(null);
    setFinishedAt(null);
    setNow(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 text-sm font-mono flex-wrap justify-center">
        <span className="text-cyan-400 flex items-center gap-1"><Keyboard size={14} /> {wpm} WPM</span>
        <span className="text-green-400">Accuracy: {accuracy}%</span>
        <span className="text-gray-400 flex items-center gap-1"><Timer size={14} /> {elapsed.toFixed(1)}s</span>
        <span className="text-yellow-400 flex items-center gap-1"><Trophy size={14} /> Best: {best}</span>
      </div>

      <div
        className="w-full p-4 rounded-lg bg-[#1e1e1e] border border-[#3c3c3c] font-mono text-lg leading-relaxed wrap-break-word select-none cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {snippet.split('').map((ch, i) => {
          let cls = 'text-gray-500';
          if (i < input.length) cls = input[i] === ch ? 'text-green-400' : 'text-red-400 bg-red-900/30';
          else if (i === input.length) cls = 'text-white bg-cyan-600/40 animate-pulse';
          return <span key={i} className={cls}>{ch === ' ' ? '\u00a0' : ch}</span>;
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={onChange}
        disabled={done}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full px-3 py-2 rounded bg-[#0d0d0d] border border-[#3c3c3c] text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
        placeholder={done ? 'Finished! Restart to try again.' : 'Start typing…'}
        aria-label="Typing input"
      />

      {done && (
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">Done!</div>
          <div className="text-sm text-gray-400 mt-1">{wpm} WPM · {accuracy}% accuracy · {elapsed.toFixed(1)}s</div>
        </div>
      )}

      <button
        onClick={restart}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e1e1e] text-cyan-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm cursor-pointer"
      >
        <RotateCcw size={14} /> New Snippet
      </button>

      <p className="text-xs text-[#6e7681] text-center">Type the code snippet as fast and accurately as you can. Timer starts on first keystroke.</p>
    </div>
  );
}
