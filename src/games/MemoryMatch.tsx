import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Clock, Move, Trophy } from 'lucide-react';

const PAIRS = 8;
const EMOJIS = ['⚛️','🔥','🐍','🚀','🎨','📦','🔒','☁️','🧩','🔧','🌐','📱','🤖','⚡','🛡️','🎯'];

interface Card {
  id: number;
  icon: string;
  matched: boolean;
}

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck(): Card[] {
  const icons = shuffle(EMOJIS).slice(0, PAIRS);
  const pairs = [...icons, ...icons];
  return shuffle(pairs).map((icon, i) => ({ id: i, icon, matched: false }));
}

export default function MemoryMatch() {
  const [deck, setDeck] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('games.memory.best')) || Infinity; } catch { return Infinity; }
  });
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (won) { if (timer.current) clearInterval(timer.current); timer.current = null; return; }
    if (!timer.current && (moves > 0 || flipped.length > 0)) {
      timer.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  }, [won, moves, flipped.length]);

  function checkWin(nextDeck: Card[]) {
    if (nextDeck.every(c => c.matched)) {
      setWon(true);
      const score = moves + 1;
      if (score < best) {
        setBest(score);
        try { localStorage.setItem('games.memory.best', String(score)); } catch { /* storage blocked */ }
      }
    }
  }

  function reset() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setDeck(buildDeck());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setWon(false);
  }

  function onCard(i: number) {
    if (won || deck[i].matched || flipped.includes(i) || flipped.length >= 2) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = next;
      if (deck[a].icon === deck[b].icon) {
        setTimeout(() => {
          const updated = deck.map((c, idx) => (idx === a || idx === b ? { ...c, matched: true } : c));
          setDeck(updated);
          setFlipped([]);
          checkWin(updated);
        }, 400);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  const isFlipped = (i: number) => flipped.includes(i) || deck[i].matched;

  const timeStr = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [seconds]);

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="flex items-center gap-4 text-sm font-mono">
        <span className="text-cyan-400 flex items-center gap-1"><Move size={14}/> Moves: {moves}</span>
        <span className="text-yellow-400 flex items-center gap-1"><Clock size={14}/> {timeStr}</span>
        <span className="text-purple-400 flex items-center gap-1"><Trophy size={14}/> Best: {best === Infinity ? '-' : best}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 select-none">
        {deck.map((card, i) => {
          const show = isFlipped(i);
          return (
            <button
              key={card.id}
              onClick={() => onCard(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCard(i); } }}
              className={`w-16 h-16 rounded-lg border flex items-center justify-center text-2xl transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500
                ${show ? 'bg-[#1e1e1e] border-[#3c3c3c] scale-100' : 'bg-[#252526] border-[#454545] hover:bg-[#2a2d2e] scale-95'}
              `}
              aria-label={show ? `Card ${i + 1} ${card.icon}` : `Card ${i + 1} hidden`}
              aria-pressed={show ? 'true' : 'false'}
            >
              {show ? card.icon : '❓'}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">You won!</div>
          <div className="text-sm text-gray-400 mt-1">Moves: {moves} · Time: {timeStr}</div>
        </div>
      )}

      <button onClick={reset} className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1e1e1e] text-cyan-400 hover:bg-[#2a2d2e] border border-[#3c3c3c] text-sm">
        <RotateCcw size={14} /> Restart
      </button>
    </div>
  );
}
