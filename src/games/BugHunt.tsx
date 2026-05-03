import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Heart, Timer, Trophy } from 'lucide-react';

const GRID = 5, ROUND_MS = 30000, SPAWN_MAX = 1500;

type Cell = null | 'bug' | 'feature';

function lk(k: string) { return `games.bughunt.${k}`; }

export default function BugHunt() {
  const [grid, setGrid] = useState<Cell[]>(Array(GRID * GRID).fill(null));
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(ROUND_MS);
  const [level, setLevel] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [over, setOver] = useState(false);
  const [hs, setHs] = useState(() => { try { return Number(localStorage.getItem(lk('hs'))) || 0; } catch { return 0; } });
  const timer = useRef<number | null>(null);
  const spawner = useRef<number | null>(null);
  const tickStart = useRef(0);
  const playingRef = useRef(false);
  const scoreRef = useRef(0);
  const hsRef = useRef(hs);
  useEffect(() => { hsRef.current = hs; }, [hs]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  function start() {
    setScore(0); setLives(3); setTime(ROUND_MS); setLevel(1); setOver(false);
    setPlaying(true); setGrid(Array(GRID * GRID).fill(null));
    playingRef.current = true;
    scoreRef.current = 0;
    if (timer.current) clearInterval(timer.current);
    tickStart.current = 0;
    timer.current = window.setInterval(() => {
      const now = Date.now();
      if (tickStart.current === 0) tickStart.current = now;
      const elapsed = now - tickStart.current;
      const remaining = Math.max(0, ROUND_MS - elapsed);
      setTime(remaining);
      if (remaining <= 0) { endGame(); }
    }, 200);
    scheduleSpawn(1);
  }

  function endGame() {
    playingRef.current = false;
    setPlaying(false); setOver(true);
    if (timer.current) clearInterval(timer.current);
    if (spawner.current) clearTimeout(spawner.current);
    timer.current = null; spawner.current = null;
    const h = Math.max(scoreRef.current, hsRef.current);
    try { localStorage.setItem(lk('hs'), String(h)); } catch { /* blocked */ }
    setHs(h);
  }

  function scheduleSpawn(lvl: number) {
    const delay = Math.max(300, SPAWN_MAX - (lvl - 1) * 120);
    if (spawner.current) clearTimeout(spawner.current);
    spawner.current = window.setTimeout(() => {
      spawner.current = null;
      if (!playingRef.current) return;
      setGrid(prev => {
        const empty = prev.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
        if (empty.length === 0) return prev;
        const idx = empty[Math.floor(Math.random() * empty.length)];
        const isBug = Math.random() > 0.25; // 75% bugs, 25% features
        const next = [...prev];
        next[idx] = isBug ? 'bug' : 'feature';
        // Auto-clear old cells after a while to keep board playable
        window.setTimeout(() => {
          setGrid(p => { const n = [...p]; if (n[idx] === next[idx]) n[idx] = null; return n; });
        }, Math.max(1200, 2500 - lvl * 150));
        return next;
      });
      scheduleSpawn(lvl);
    }, delay);
  }

  function tap(i: number) {
    if (!playing || over) return;
    const cell = grid[i];
    if (!cell) return;
    if (cell === 'bug') {
      const nextScore = score + 10 * level;
      setScore(nextScore);
      if (nextScore > 0 && nextScore % 100 === 0) setLevel(l => l + 1);
      setGrid(g => { const n = [...g]; n[i] = null; return n; });
    }
    if (cell === 'feature') { setLives(l => { const nl = l - 1; if (nl <= 0) { endGame(); } return Math.max(0, nl); }); setGrid(g => { const n = [...g]; n[i] = null; return n; }); }
  }

  useEffect(() => { return () => { if (timer.current) clearInterval(timer.current); if (spawner.current) clearTimeout(spawner.current); }; }, []);

  const timeStr = `${Math.ceil(time / 1000)}s`;
  const bugEmoji = '🐛'; const featureEmoji = '✅';

  return (
    <div className="flex flex-col items-center gap-3 p-4 select-none">
      <div className="flex items-center gap-4 text-sm font-mono">
        <span className="text-green-400">Score: {score}</span>
        <span className="text-red-400 flex items-center gap-1"><Heart size={14} /> {lives}</span>
        <span className="text-yellow-400 flex items-center gap-1"><Timer size={14} /> {timeStr}</span>
        <span className="text-purple-400">Lv.{level}</span>
        <span className="text-yellow-400 flex items-center gap-1"><Trophy size={14} /> {hs}</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {grid.map((cell, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(i); } }}
            className={`w-14 h-14 rounded-lg border flex items-center justify-center text-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500
              ${cell ? 'bg-[#1e1e1e] border-[#3c3c3c] scale-100 cursor-pointer hover:bg-[#2a2d2e]' : 'bg-[#0d0d0d] border-[#252526] scale-95 cursor-default'}
            `}
            aria-label={cell ? `${cell} at cell ${i + 1}` : `Empty cell ${i + 1}`}
          >
            {cell === 'bug' ? bugEmoji : cell === 'feature' ? featureEmoji : ''}
          </button>
        ))}
      </div>

      {!playing && !over && (
        <button onClick={start} className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-500 transition-colors cursor-pointer">
          Start Game
        </button>
      )}

      {over && (
        <div className="text-center">
          <div className="text-xl font-bold text-red-400">Game Over</div>
          <div className="text-sm text-gray-400 mt-1">Score: {score} · Level: {level}</div>
          <button onClick={start} className="mt-2 flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded bg-[#1e1e1e] text-green-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm cursor-pointer">
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      )}

      <p className="text-xs text-[#6e7681] text-center">Click bugs to squash. Avoid features (green checks). Speed increases each level.</p>
    </div>
  );
}
