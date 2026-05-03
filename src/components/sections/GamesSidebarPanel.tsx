import { useNavigate } from 'react-router-dom';
import { Gamepad2, Play, Star, Zap } from 'lucide-react';
import { games } from '../../games/registry';

export default function GamesSidebarPanel() {
  const navigate = useNavigate();
  return (
    <div className="px-3 pb-4 flex-1 overflow-y-auto">
      <div className="flex items-center gap-2 mb-3 text-gray-300">
        <Gamepad2 className="text-purple-400" size={14} />
        <span className="text-xs">arcade/</span>
      </div>
      <div className="space-y-2 text-sm">
        {games.map(g => (
          <button
            key={g.slug}
            onClick={() => navigate(`/games/${g.slug}`)}
            className="w-full text-left flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all duration-150 text-gray-300 hover:bg-gray-700 hover:text-white border-l-2 border-transparent hover:border-purple-400 bg-transparent border-none"
          >
            <g.icon size={14} className={g.accent} />
            <span className="flex-1">{g.name}</span>
            <Play size={12} className="text-gray-500" />
          </button>
        ))}
      </div>
      <div className="mt-5 bg-gray-900 p-3 rounded border border-gray-700 text-xs space-y-1">
        <div className="text-purple-400 flex items-center gap-1"><Zap size={12}/> Quick Stats</div>
        <div className="text-gray-400">Games: <span className="text-white">{games.length}</span></div>
        <div className="text-gray-400">Latest: <span className="text-white">{games[games.length - 1]?.name}</span></div>
        <button onClick={() => navigate('/games')} className="mt-2 w-full text-center text-purple-400 hover:text-purple-300 bg-transparent border-none cursor-pointer text-xs flex items-center justify-center gap-1">
          <Star size={10}/> Open Arcade
        </button>
      </div>
    </div>
  );
}
