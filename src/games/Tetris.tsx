import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw, Pause, Play, Trophy } from 'lucide-react';

const COLS = 10, ROWS = 20, CELL = 24;
const TICK = 800;

const SHAPES = [
  { color: '#22c55e', blocks: [[1,1,1,1]] },
  { color: '#3b82f6', blocks: [[1,1],[1,1]] },
  { color: '#ef4444', blocks: [[0,1,0],[1,1,1]] },
  { color: '#f59e0b', blocks: [[1,1,0],[0,1,1]] },
  { color: '#a855f7', blocks: [[0,1,1],[1,1,0]] },
  { color: '#06b6d4', blocks: [[1,0,0],[1,1,1]] },
  { color: '#f97316', blocks: [[0,0,1],[1,1,1]] },
];

type Piece = { color: string; x: number; y: number; blocks: number[][] };

function emptyBoard(): string[][] { return Array.from({ length: ROWS }, () => Array(COLS).fill('')); }

function rotate(blocks: number[][]): number[][] {
  const h = blocks.length, w = blocks[0].length;
  const out: number[][] = Array.from({ length: w }, () => Array(h).fill(0));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[x][h - 1 - y] = blocks[y][x];
  return out;
}

function lk(k: string) { return `games.tetris.${k}`; }

export default function Tetris() {
  const cv = useRef<HTMLCanvasElement | null>(null);
  const board = useRef<string[][]>(emptyBoard());
  const cur = useRef<Piece | null>(null);
  const tm = useRef<number | null>(null);
  const tickRef = useRef<() => void>(() => {});
  const moveRef = useRef<(dx: number, dy: number, rot?: number[][]) => boolean>(() => false);
  const restartRef = useRef<() => void>(() => {});
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [hs, setHs] = useState(() => { try { return Number(localStorage.getItem(lk('hs'))) || 0; } catch { return 0; } });
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [f, setF] = useState(0);

  const valid = useCallback((p: Piece, b: string[][]): boolean => {
    for (let y = 0; y < p.blocks.length; y++)
      for (let x = 0; x < p.blocks[y].length; x++)
        if (p.blocks[y][x]) {
          const nx = p.x + x, ny = p.y + y;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
          if (ny >= 0 && b[ny][nx] !== '') return false;
        }
    return true;
  }, []);

  const lock = useCallback((p: Piece, b: string[][]) => {
    for (let y = 0; y < p.blocks.length; y++)
      for (let x = 0; x < p.blocks[y].length; x++)
        if (p.blocks[y][x] && p.y + y >= 0) b[p.y + y][p.x + x] = p.color;
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (b[r].every(c => c !== '')) {
        b.splice(r, 1); b.unshift(Array(COLS).fill('')); cleared++; r++;
      }
    }
    if (cleared > 0) { setScore(s => s + cleared * cleared * 100); setLines(l => l + cleared); }
  }, []);

  const spawn = useCallback(() => {
    const s = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const p: Piece = {
      color: s.color,
      x: Math.floor(COLS / 2) - Math.ceil(s.blocks[0].length / 2),
      y: 0,
      blocks: s.blocks.map(r => [...r]),
    };
    if (!valid(p, board.current)) {
      setOver(true);
      setHs(prev => {
        const h = Math.max(score, prev);
        try { localStorage.setItem(lk('hs'), String(h)); } catch { /* blocked */ }
        return h;
      });
      setF(x => x + 1);
      return false;
    }
    cur.current = p;
    return true;
  }, [valid, score]);

  const move = useCallback((dx: number, dy: number, rot?: number[][]) => {
    const c = cur.current; if (!c) return false;
    const np: Piece = { ...c, x: c.x + dx, y: c.y + dy, blocks: rot || c.blocks };
    if (valid(np, board.current)) { cur.current = np; setF(x => x + 1); return true; }
    return false;
  }, [valid]);

  const tick = useCallback(() => {
    const delay = Math.max(100, TICK - Math.floor(lines / 5) * 80);
    if (tm.current) window.clearTimeout(tm.current);
    tm.current = window.setTimeout(() => {
      tm.current = null;
      if (paused || over) return;
      if (!cur.current && !spawn()) return;
      if (!moveRef.current(0, 1)) {
        if (cur.current) { lock(cur.current, board.current); cur.current = null; }
      }
      setF(x => x + 1);
      tickRef.current();
    }, delay);
  }, [paused, over, lines, spawn, lock]);

  const restart = useCallback(() => {
    if (tm.current) { window.clearTimeout(tm.current); tm.current = null; }
    board.current = emptyBoard();
    cur.current = null;
    setScore(0); setLines(0); setOver(false); setPaused(false);
    setF(x => x + 1);
    tickRef.current();
  }, []);

  useLayoutEffect(() => { tickRef.current = tick; moveRef.current = move; restartRef.current = restart; }, [tick, move, restart]);

  useEffect(() => {
    if (!paused && !over && tm.current === null) tick();
    return () => { if (tm.current) { window.clearTimeout(tm.current); tm.current = null; } };
  }, [paused, over, tick]);

  useEffect(() => {
    const c = cv.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
    const w = COLS * CELL, h = ROWS * CELL;
    ctx.fillStyle = '#0f0f0f'; ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      ctx.strokeStyle = '#1a1a1a'; ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
      const v = board.current[y][x];
      if (v) { ctx.fillStyle = v; ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2); }
    }
    const p = cur.current;
    if (p) {
      for (let y = 0; y < p.blocks.length; y++) for (let x = 0; x < p.blocks[y].length; x++) if (p.blocks[y][x]) {
        const px = (p.x + x) * CELL, py = (p.y + y) * CELL;
        ctx.fillStyle = p.color; ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.strokeRect(px + 2, py + 2, CELL - 4, CELL - 4);
      }
    }
    if (over) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, w, h); }
  }, [f, over]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); return; }
      if (e.key === 'Enter' && over) { restartRef.current(); return; }
      if (over || paused) return;
      if (['ArrowLeft','a','A'].includes(e.key)) { e.preventDefault(); moveRef.current(-1, 0); }
      if (['ArrowRight','d','D'].includes(e.key)) { e.preventDefault(); moveRef.current(1, 0); }
      if (['ArrowDown','s','S'].includes(e.key)) {
        e.preventDefault();
        if (!moveRef.current(0, 1)) {
          if (cur.current) { lock(cur.current, board.current); cur.current = null; setF(x => x + 1); }
        }
      }
      if (['ArrowUp','w','W'].includes(e.key)) {
        e.preventDefault();
        const c = cur.current; if (c) moveRef.current(0, 0, rotate(c.blocks));
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [over, paused, lock]);

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="flex items-center gap-4 text-sm font-mono">
        <span className="text-cyan-400">Score: {score}</span>
        <span className="text-green-400">Lines: {lines}</span>
        <span className="text-yellow-400 flex items-center gap-1"><Trophy size={14} /> Best: {hs}</span>
      </div>
      <div className="relative">
        <canvas ref={cv} width={COLS * CELL} height={ROWS * CELL} className="rounded-lg border border-[#1a1a1a] bg-[#0f0f0f]" tabIndex={0} aria-label="Tetris game canvas" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="text-2xl font-bold text-red-400">Game Over</div>
            <button onClick={restart} className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1e1e1e] text-cyan-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm cursor-pointer">
              <RotateCcw size={14} /> Restart
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPaused(p => !p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e1e1e] text-cyan-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm cursor-pointer">
          {paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
        </button>
        <button onClick={restart} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm cursor-pointer">
          <RotateCcw size={14} /> Restart
        </button>
      </div>
      <p className="text-xs text-[#6e7681] text-center">Arrows / WASD to move. Up/W to rotate. Space to pause.</p>
    </div>
  );
}
