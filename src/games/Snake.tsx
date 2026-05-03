import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw, Pause, Play, Trophy } from 'lucide-react';

const GRID = 20, CELL = 24, TICK = 120;
const keyMap: Record<string, [number, number]> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], W: [0, -1], s: [0, 1], S: [0, 1], a: [-1, 0], A: [-1, 0], d: [1, 0], D: [1, 0],
};
type P = { x: number; y: number };
function randApple(body: P[]): P {
  let p: P;
  do { p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
  while (body.some(s => s.x === p.x && s.y === p.y));
  return p;
}
function lk(k: string) { return `games.snake.${k}`; }

export default function Snake() {
  const cv = useRef<HTMLCanvasElement | null>(null);
  const dir = useRef<P>({ x: 1, y: 0 });
  const q = useRef<P | null>(null);
  const body = useRef<P[]>([{ x: 3, y: 10 }, { x: 2, y: 10 }, { x: 1, y: 10 }]);
  const apple = useRef<P>({ x: 15, y: 10 });
  const tm = useRef<number | null>(null);
  const sc = useRef(0);
  const ts = useRef<{ x: number; y: number } | null>(null);
  const tickRef = useRef<((s: number) => void) | null>(null);
  const restartRef = useRef<(() => void) | null>(null);
  const [score, setScore] = useState(0);
  const [hs, setHs] = useState(() => {
    try { return Number(localStorage.getItem(lk('hs'))) || 0; } catch { return 0; }
  });
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [f, setF] = useState(0);

  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const w = GRID * CELL, h = GRID * CELL;
    ctx.fillStyle = '#0f0f0f'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(w, i * CELL); ctx.stroke();
    }
    body.current.forEach((seg, i) => {
      const head = i === 0;
      ctx.fillStyle = head ? '#22c55e' : '#16a34a';
      const pad = head ? 1 : 2;
      ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
      if (head) { ctx.fillStyle = '#000'; ctx.fillRect(seg.x * CELL + 5, seg.y * CELL + 5, 3, 3); ctx.fillRect(seg.x * CELL + 14, seg.y * CELL + 5, 3, 3); }
    });
    const a = apple.current;
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(a.x * CELL + CELL / 2, a.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2); ctx.fill();
    if (over) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, w, h); }
  }, [f, over]);

  const tick = useCallback((s: number) => {
    const factor = Math.max(0.4, 1 - Math.floor(s / 5) * 0.08);
    const delay = TICK * factor;
    if (tm.current) window.clearTimeout(tm.current);
    tm.current = window.setTimeout(() => {
      tm.current = null; if (paused || over) return;
      if (q.current) { dir.current = q.current; q.current = null; }
      const d = dir.current, b = body.current;
      const head = { x: b[0].x + d.x, y: b[0].y + d.y };
      if (head.x < 0) head.x = GRID - 1; if (head.x >= GRID) head.x = 0;
      if (head.y < 0) head.y = GRID - 1; if (head.y >= GRID) head.y = 0;
      if (b.some(s => s.x === head.x && s.y === head.y)) { setOver(true); const h = Math.max(sc.current, hs); try { localStorage.setItem(lk('hs'), String(h)); } catch { /* storage may be blocked */ } setHs(h); setF(x => x + 1); return; }
      const ate = head.x === apple.current.x && head.y === apple.current.y;
      const nb = [head, ...(ate ? b : b.slice(0, -1))]; body.current = nb;
      if (ate) { sc.current += 1; setScore(sc.current); apple.current = randApple(nb); }
      setF(x => x + 1); tickRef.current?.(sc.current);
    }, delay);
  }, [paused, over, hs]);

  useEffect(() => {
    if (!paused && !over && tm.current === null) tick(sc.current);
    return () => { if (tm.current) { window.clearTimeout(tm.current); tm.current = null; } };
  }, [paused, over, tick]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); return; }
      if (e.key === 'Enter' && over) { restartRef.current?.(); return; }
      const n = keyMap[e.key]; if (!n) return; e.preventDefault();
      const cur = dir.current;
      if (n[0] && n[0] === -cur.x) return; if (n[1] && n[1] === -cur.y) return;
      q.current = { x: n[0], y: n[1] };
    };
    window.addEventListener('keydown', on); return () => window.removeEventListener('keydown', on);
  }, [over]);

  useEffect(() => {
    const el = cv.current; if (!el) return;
    const start = (e: TouchEvent) => { ts.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }; };
    const end = (e: TouchEvent) => {
      if (!ts.current) return;
      const dx = e.changedTouches[0].clientX - ts.current.x, dy = e.changedTouches[0].clientY - ts.current.y;
      const ax = Math.abs(dx), ay = Math.abs(dy); if (Math.max(ax, ay) < 20) return;
      const cur = dir.current; let n: P | null = null;
      if (ax > ay) n = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }; else n = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      if (n) { if (n.x && n.x === -cur.x) return; if (n.y && n.y === -cur.y) return; q.current = n; }
      ts.current = null;
    };
    el.addEventListener('touchstart', start); el.addEventListener('touchend', end);
    return () => { el.removeEventListener('touchstart', start); el.removeEventListener('touchend', end); };
  }, []);

  function restart() {
    if (tm.current) { window.clearTimeout(tm.current); tm.current = null; }
    dir.current = { x: 1, y: 0 }; q.current = null;
    body.current = [{ x: 3, y: 10 }, { x: 2, y: 10 }, { x: 1, y: 10 }];
    apple.current = { x: 15, y: 10 };
    sc.current = 0; setScore(0); setOver(false); setPaused(false); setF(x => x + 1);
    tickRef.current?.(0);
  }

  useLayoutEffect(() => {
    tickRef.current = tick;
    restartRef.current = restart;
  });

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-green-400 font-mono">Score: {score}</span>
        <span className="text-yellow-400 font-mono flex items-center gap-1"><Trophy size={14} /> Best: {hs}</span>
      </div>
      <div className="relative">
        <canvas ref={cv} width={GRID * CELL} height={GRID * CELL} className="rounded-lg border border-[#1a1a1a] bg-[#0f0f0f]" tabIndex={0} aria-label="Snake game canvas" />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="text-2xl font-bold text-red-400">Game Over</div>
            <button onClick={restart} className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1e1e1e] text-green-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm">
              <RotateCcw size={14} /> Restart
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPaused(p => !p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e1e1e] text-cyan-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm">
          {paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
        </button>
        <button onClick={restart} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm">
          <RotateCcw size={14} /> Restart
        </button>
      </div>
      <p className="text-xs text-[#6e7681] text-center">Arrows / WASD to move. Space to pause. Swipe on touch.</p>
    </div>
  );
}

