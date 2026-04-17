import { motion } from 'framer-motion';
import { GitBranch, Quote, Sparkles, Terminal as TerminalIcon, Blocks, Package } from 'lucide-react';
import GitHubProfile from './GitHubProfile';
import FullTerminal from './FullTerminal';
import { testimonials } from '../data/testimonialsData';
import { nowItems, nowUpdated } from '../data/nowData';

/* ═══════════════════════════════════════════════════════════════
   SOURCE CONTROL — right main area
   Shows: full GitHub profile dashboard + themed build log
   ═══════════════════════════════════════════════════════════════ */

const commits = [
  { hash: 'a3f12c9', author: 'ahmad-alghawi', msg: 'feat: source control dashboard — real GitHub data', date: '2 hours ago',  color: 'text-green-400'  },
  { hash: 'b7e09d1', author: 'ahmad-alghawi', msg: 'feat: hacker-mode cinematic easter egg',             date: '5 hours ago',  color: 'text-green-400'  },
  { hash: 'c1d84a2', author: 'ahmad-alghawi', msg: 'feat: theme picker + compact / zen modes',           date: '1 day ago',    color: 'text-green-400'  },
  { hash: 'f5c20b3', author: 'ahmad-alghawi', msg: 'fix: tailwind v4 CSS vars across components',        date: '2 days ago',   color: 'text-yellow-400' },
  { hash: '9ab3e7f', author: 'ahmad-alghawi', msg: 'init: portfolio-main scaffold',                      date: '3 days ago',   color: 'text-blue-400'   },
  { hash: 'e2d08c4', author: 'ahmad-alghawi', msg: 'chore: setup vite + typescript',                     date: '3 days ago',   color: 'text-gray-400'   },
  { hash: '4b1f9a2', author: 'ahmad-alghawi', msg: 'feat: loading screen + matrix rain',                 date: '4 days ago',   color: 'text-green-400'  },
];

export function SourceControlView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="text-orange-400" size={24} />
          <span className="text-white text-xl font-bold">Source Control</span>
          <span className="ml-auto text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> live
          </span>
        </div>
        <p className="text-gray-400 text-sm font-mono">
          Real-time data from <span className="text-cyan-400">github.com/ahmadalghawi</span>
          <span className="text-gray-600"> · cached 1h</span>
        </p>
      </div>

      {/* Full GitHub profile dashboard */}
      <GitHubProfile />

      {/* Portfolio build log (themed) */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-5">
          <GitBranch className="text-green-400" size={20} />
          <span className="text-white text-lg font-bold">portfolio build log</span>
          <span className="text-gray-500 text-xs font-mono ml-auto">portfolio2026 / main</span>
        </div>

        <div className="space-y-3 font-mono text-sm">
          {commits.map((c, i) => (
            <motion.div
              key={c.hash}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-4 p-3 bg-gray-900 rounded border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <span className="text-orange-400 shrink-0 text-xs mt-0.5">{c.hash}</span>
              <div className="flex-1 min-w-0">
                <div className={c.color}>{c.msg}</div>
                <div className="text-gray-500 text-xs mt-1 flex items-center gap-2">
                  <span>{c.author}</span>
                  <span>·</span>
                  <span>{c.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXTENSIONS — right main area
   Shows: now.md + recommendations.md as full-size cards
   ═══════════════════════════════════════════════════════════════ */

export function ExtensionsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <Blocks className="text-purple-400" size={24} />
          <span className="text-white text-xl font-bold">Extensions</span>
        </div>
        <p className="text-gray-400 text-sm font-mono">
          Extras installed on <span className="text-cyan-400">ahmad-alghawi.dev</span>
        </p>
      </div>

      {/* now.md */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-yellow-400" size={20} />
          <span className="text-white text-lg font-bold">now.md</span>
          <span className="text-gray-500 text-xs font-mono ml-auto">updated {nowUpdated}</span>
        </div>
        <div className="font-mono text-sm space-y-2">
          {nowItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3"
            >
              <span className="text-cyan-400 w-20 shrink-0">{item.label}:</span>
              <span className="text-gray-300">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Quote className="text-purple-400" size={20} />
          <span className="text-white text-lg font-bold">recommendations.md</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-gray-900 border-l-2 border-purple-400 rounded-r p-4 font-mono text-sm"
            >
              <div className="text-gray-300 leading-relaxed mb-3">"{t.quote}"</div>
              <footer className="text-xs">
                <div className="text-cyan-400">— {t.author}</div>
                <div className="text-gray-500">{t.role} · {t.company}</div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>

      {/* Tech stack card */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-cyan-400" size={20} />
          <span className="text-white text-lg font-bold">tech-stack.json</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          {[
            { cat: 'Frontend', items: 'React · Next.js · TypeScript · Tailwind' },
            { cat: 'Backend',  items: 'Node.js · Express · MySQL · Firebase' },
            { cat: 'Mobile',   items: 'React Native · Expo' },
            { cat: 'AI Tools', items: 'Cursor · Windsurf · Claude · ChatGPT' },
          ].map(t => (
            <div key={t.cat} className="bg-gray-900 rounded p-3 border border-gray-700">
              <div className="text-cyan-400 font-bold mb-1">{t.cat}</div>
              <div className="text-gray-300 leading-relaxed">{t.items}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TERMINAL — right main area
   Full-size terminal with title bar
   ═══════════════════════════════════════════════════════════════ */

export function TerminalView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <TerminalIcon className="text-green-400" size={24} />
          <span className="text-white text-xl font-bold">Terminal</span>
        </div>
        <p className="text-gray-400 text-sm font-mono">
          Interactive shell — type <span className="text-cyan-400">help</span> to see available commands
        </p>
      </div>

      {/* Full terminal */}
      <FullTerminal />
    </motion.div>
  );
}
