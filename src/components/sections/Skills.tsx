import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

const skillGroups = [
  {
    key: 'frontend',
    color: 'bg-cyan-400',
    items: [
      { name: 'React.js',     level: 95 },
      { name: 'Next.js',      level: 88 },
      { name: 'TypeScript',   level: 85 },
      { name: 'JavaScript',   level: 92 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'HTML / CSS',   level: 95 },
    ],
  },
  {
    key: 'backend',
    color: 'bg-green-400',
    items: [
      { name: 'Node.js',     level: 82 },
      { name: 'Express.js',  level: 80 },
      { name: 'MySQL',       level: 75 },
      { name: 'Firebase',    level: 85 },
      { name: 'JWT / Auth',  level: 78 },
      { name: 'Stripe',      level: 70 },
    ],
  },
  {
    key: 'mobile',
    color: 'bg-purple-400',
    items: [
      { name: 'React Native', level: 85 },
      { name: 'Expo',         level: 82 },
    ],
  },
  {
    key: 'ai_tools',
    color: 'bg-yellow-400',
    items: [
      { name: 'Cursor',     level: 90 },
      { name: 'Windsurf',   level: 88 },
      { name: 'Claude CLI', level: 85 },
      { name: 'ChatGPT',    level: 90 },
    ],
  },
  {
    key: 'design_workflow',
    color: 'bg-orange-400',
    items: [
      { name: 'Figma',      level: 80 },
      { name: 'Git/GitHub', level: 88 },
      { name: 'Vercel',     level: 82 },
      { name: 'Jira',       level: 75 },
    ],
  },
];

export default function Skills() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* skills.js syntax view */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Code className="text-yellow-400" size={24} />
          <span className="text-white text-xl font-bold">skills.js</span>
        </div>
        <div className="text-green-400 font-mono text-sm">
          <div className="text-purple-400 mb-2">const skills = {'{'}</div>
          <div className="ml-4 space-y-3">
            {skillGroups.map((group, gIdx) => (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: gIdx * 0.12 }}
              >
                <span className="text-cyan-400">{group.key}:</span> [
                <div className="ml-4 flex flex-wrap gap-1.5 my-1">
                  {group.items.map((item, i) => (
                    <motion.span
                      key={item.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: gIdx * 0.12 + i * 0.05 }}
                      className="text-green-300"
                    >
                      '{item.name}'{i < group.items.length - 1 ? ',' : ''}
                    </motion.span>
                  ))}
                </div>
                ],
              </motion.div>
            ))}
          </div>
          <div className="text-purple-400 mt-2">{'};'}</div>
          <div className="mt-4">
            <span className="text-green-400">export default</span>{' '}
            <span className="text-white">skills;</span>
          </div>
        </div>
      </div>

      {/* Proficiency bars */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-gray-500 font-mono text-xs mb-5">{'// proficiency levels'}</div>
        <div className="space-y-6">
          {skillGroups.map((group, gIdx) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gIdx * 0.1 }}
            >
              <div className="text-cyan-400 font-mono text-xs mb-2">{group.key}/</div>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-gray-400 font-mono text-xs w-32 shrink-0">{item.name}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${group.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ delay: gIdx * 0.1 + i * 0.05 + 0.3, duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-gray-500 font-mono text-xs w-8 text-right">{item.level}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
