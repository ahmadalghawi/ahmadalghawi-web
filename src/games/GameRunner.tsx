import { useParams, useNavigate } from 'react-router-dom';
import { getGame } from './registry';
import { ArrowLeft } from 'lucide-react';

export default function GameRunner() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const game = getGame(slug || '');

  if (!game) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-400">Game not found</h2>
        <p className="text-gray-400 mt-2">No mini-game matches <code className="bg-gray-800 px-1 rounded">/{slug}</code>.</p>
        <button onClick={() => navigate('/games')} className="mt-4 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 mx-auto cursor-pointer bg-transparent border-none">
          <ArrowLeft size={14} /> Back to Arcade
        </button>
      </div>
    );
  }

  const Icon = game.icon;
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#3c3c3c] bg-[#1e1e1e]">
        <button onClick={() => navigate('/games')} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer" aria-label="Back to arcade">
          <ArrowLeft size={16} />
        </button>
        <Icon size={18} className={game.accent} />
        <div>
          <h1 className="text-sm font-semibold text-white">{game.name}</h1>
          <p className="text-xs text-gray-400">{game.tagline}</p>
        </div>
        <span className="ml-auto text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{game.difficulty}</span>
      </div>
      <div className="flex-1 overflow-auto bg-[#0d0d0d] flex items-start justify-center">
        <game.Component />
      </div>
    </div>
  );
}
