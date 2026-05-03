import { useNavigate } from 'react-router-dom';
import { games } from './registry';
import { Play, ArrowRight } from 'lucide-react';

export default function GamesLauncher() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-purple-400">Arcade</h1>
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">{games.length} games</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {games.map(g => {
          const Icon = g.icon;
          return (
            <div key={g.slug} className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-4 flex flex-col gap-2 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center gap-2">
                <Icon size={18} className={g.accent} />
                <span className="font-semibold text-white">{g.name}</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 ml-auto">{g.difficulty}</span>
              </div>
              <p className="text-sm text-gray-400">{g.tagline}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                {g.controls.map(c => (
                  <span key={c} className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">{c}</span>
                ))}
                {g.supportsTouch && <span className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">Touch</span>}
              </div>
              <button
                onClick={() => navigate(`/games/${g.slug}`)}
                className="mt-2 flex items-center justify-center gap-2 w-full py-1.5 rounded bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 text-sm transition-colors cursor-pointer"
              >
                <Play size={14} /> Play <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
