import { useCallback, useEffect, useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

const SIZE = 4;
type Board = number[][];

function lk(k: string) { return `games.2048.${k}`; }

function emptyBoard(): Board { return Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); }

function addRandom(b: Board): Board {
  const empty: [number, number][] = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (b[y][x] === 0) empty.push([y, x]);
  if (empty.length === 0) return b;
  const [y, x] = empty[Math.floor(Math.random() * empty.length)];
  const nb = b.map(r => [...r]);
  nb[y][x] = Math.random() < 0.9 ? 2 : 4;
  return nb;
}

function slideRowLeft(row: number[]): { row: number[]; gained: number } {
  const filtered = row.filter(v => v !== 0);
  const out: number[] = []; let gained = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      out.push(merged); gained += merged; i++;
    } else {
      out.push(filtered[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { row: out, gained };
}

function rotateCW(b: Board): Board {
  const out = emptyBoard();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) out[x][SIZE - 1 - y] = b[y][x];
  return out;
}

function move(b: Board, dir: 'L' | 'R' | 'U' | 'D'): { board: Board; gained: number; changed: boolean } {
  let rotations = 0;
  if (dir === 'U') rotations = 3;
  if (dir === 'R') rotations = 2;
  if (dir === 'D') rotations = 1;
  let rot = b;
  for (let i = 0; i < rotations; i++) rot = rotateCW(rot);
  let gained = 0;
  const nb = rot.map(row => { const r = slideRowLeft(row); gained += r.gained; return r.row; });
  let result = nb;
  const backRotations = (4 - rotations) % 4;
  for (let i = 0; i < backRotations; i++) result = rotateCW(result);
  const changed = JSON.stringify(result) !== JSON.stringify(b);
  return { board: result, gained, changed };
}

function hasMoves(b: Board): boolean {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (b[y][x] === 0) return true;
    if (x < SIZE - 1 && b[y][x] === b[y][x + 1]) return true;
    if (y < SIZE - 1 && b[y][x] === b[y + 1][x]) return true;
  }
  return false;
}

const TILE_COLORS: Record<number, string> = {
  0: 'bg-[#1e1e1e] text-transparent',
  2: 'bg-[#2a2d2e] text-gray-300',
  4: 'bg-[#323336] text-gray-200',
  8: 'bg-[#c97c2a] text-white',
  16: 'bg-[#d97706] text-white',
  32: 'bg-[#dc2626] text-white',
  64: 'bg-[#b91c1c] text-white',
  128: 'bg-[#ca8a04] text-white text-sm',
  256: 'bg-[#a16207] text-white text-sm',
  512: 'bg-[#15803d] text-white text-sm',
  1024: 'bg-[#059669] text-white text-xs',
  2048: 'bg-[#0891b2] text-white text-xs',
};

export default function Game2048() {
  const [board, setBoard] = useState<Board>(() => addRandom(addRandom(emptyBoard())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => { try { return Number(localStorage.getItem(lk('best'))) || 0; } catch { return 0; } });
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);

  const doMove = useCallback((dir: 'L' | 'R' | 'U' | 'D') => {
    if (over) return;
    const res = move(board, dir);
    if (!res.changed) return;
    const nb = addRandom(res.board);
    setBoard(nb);
    const newScore = score + res.gained;
    setScore(newScore);
    if (newScore > best) {
      setBest(newScore);
      try { localStorage.setItem(lk('best'), String(newScore)); } catch { /* blocked */ }
    }
    if (!won && nb.some(r => r.some(v => v >= 2048))) setWon(true);
    if (!hasMoves(nb)) setOver(true);
  }, [board, score, best, over, won]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (['ArrowLeft','a','A'].includes(e.key)) { e.preventDefault(); doMove('L'); }
      else if (['ArrowRight','d','D'].includes(e.key)) { e.preventDefault(); doMove('R'); }
      else if (['ArrowUp','w','W'].includes(e.key)) { e.preventDefault(); doMove('U'); }
      else if (['ArrowDown','s','S'].includes(e.key)) { e.preventDefault(); doMove('D'); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [doMove]);

  // Touch swipe
  useEffect(() => {
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; };
    const onEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'R' : 'L');
      else doMove(dy > 0 ? 'D' : 'U');
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [doMove]);

  function restart() {
    setBoard(addRandom(addRandom(emptyBoard())));
    setScore(0); setOver(false); setWon(false);
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4 select-none">
      <div className="flex items-center gap-4 text-sm font-mono">
        <span className="text-cyan-400">Score: {score}</span>
        <span className="text-yellow-400 flex items-center gap-1"><Trophy size={14} /> Best: {best}</span>
      </div>

      <div className="relative bg-[#0d0d0d] p-2 rounded-lg border border-[#3c3c3c]">
        <div className="grid grid-cols-4 gap-2">
          {board.flat().map((v, i) => (
            <div
              key={i}
              className={`w-16 h-16 rounded flex items-center justify-center font-bold text-xl transition-all duration-150 ${TILE_COLORS[v] ?? 'bg-[#0891b2] text-white text-xs'}`}
            >
              {v > 0 ? v : ''}
            </div>
          ))}
        </div>
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 rounded-lg">
            <div className="text-2xl font-bold text-red-400">Game Over</div>
            <button onClick={restart} className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1e1e1e] text-cyan-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm cursor-pointer">
              <RotateCcw size={14} /> Restart
            </button>
          </div>
        )}
        {won && !over && (
          <div className="absolute top-2 left-2 right-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded text-center">
            You reached 2048! Keep going or restart.
          </div>
        )}
      </div>

      <button onClick={restart} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e1e1e] text-cyan-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm cursor-pointer">
        <RotateCcw size={14} /> New Game
      </button>

      <p className="text-xs text-[#6e7681] text-center">Arrow keys / WASD / swipe. Merge tiles to reach 2048.</p>
    </div>
  );
}
