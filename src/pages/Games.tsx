import { Routes, Route } from 'react-router-dom';
import GamesLauncher from '../games/GamesLauncher';
import GameRunner from '../games/GameRunner';

export default function GamesPage() {
  return (
    <div className="h-full flex flex-col bg-[#0d0d0d]">
      <Routes>
        <Route path="/games" element={<GamesLauncher />} />
        <Route path="/games/:slug" element={<GameRunner />} />
      </Routes>
    </div>
  );
}
