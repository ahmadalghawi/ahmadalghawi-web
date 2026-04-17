import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, Terminal } from 'lucide-react';

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const attempted = location.pathname;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Error header card */}
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/50">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-400" size={24} />
          <span className="text-white text-xl font-bold">error.log</span>
        </div>

        <div className="font-mono text-sm space-y-3 bg-black rounded border border-gray-700 p-4">
          <div className="text-red-400">
            <span className="text-gray-500">$ </span>
            <span className="text-cyan-400">npm run</span>{' '}
            <span className="text-yellow-400">resolve</span>{' '}
            <span className="text-white">{attempted}</span>
          </div>

          <div className="text-gray-400 space-y-0.5">
            <div><span className="text-red-400">error</span> TS404: Cannot find module <span className="text-green-400">'{attempted}'</span> or its corresponding type declarations.</div>
            <div className="text-gray-500 ml-2">at PortfolioRouter (src/App.tsx:142:11)</div>
            <div className="text-gray-500 ml-2">at Routes (node_modules/react-router-dom)</div>
          </div>

          <div className="text-gray-400">
            <span className="text-yellow-400">hint:</span> The page you're looking for doesn't exist in this repo.
          </div>

          <div className="text-gray-400">
            <span className="text-yellow-400">suggestion:</span> Try one of the available sections below.
          </div>

          <div className="pt-2 border-t border-gray-700 text-gray-500 text-xs">
            <span className="text-red-400">Process exited with code 404</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-gray-400 font-mono text-xs mb-4">{'// available routes'}</div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors font-mono text-sm cursor-pointer border-none"
          >
            <Home size={16} /> cd /
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors font-mono text-sm cursor-pointer border-none"
          >
            <Terminal size={16} /> cd -
          </button>
        </div>
      </div>
    </motion.div>
  );
}
