import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, ChevronUp, ChevronDown } from 'lucide-react';

type Severity = 'info' | 'warn';
interface Problem {
  severity: Severity;
  code: string;
  message: string;
  file: string;
}

const PROBLEMS: Problem[] = [
  { severity: 'info', code: 'TS0000', message: 'No problems detected in candidate.',                file: 'portfolio-main/ahmad.ts'   },
  { severity: 'warn', code: 'HR1337', message: 'Availability window closing soon \u2014 consider acting.', file: 'contact.env'               },
  { severity: 'info', code: 'FX2077', message: 'High caffeine levels detected, output optimal.',      file: 'dev-environment/status.log'},
];

const colorFor = (s: Severity) => s === 'warn' ? 'text-yellow-400' : 'text-blue-400';
const IconFor  = (s: Severity) => s === 'warn' ? AlertTriangle : Info;

export default function ProblemsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-700 bg-gray-900 shrink-0">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Toggle problems panel"
        className="w-full flex items-center gap-3 px-4 py-1.5 text-xs font-mono text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
      >
        {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        <span className="uppercase tracking-wide">Problems</span>
        <span className="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-[10px]">{PROBLEMS.length}</span>
        <span className="ml-auto text-gray-500">click to {open ? 'hide' : 'show'}</span>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="max-h-40 overflow-y-auto px-4 py-2 space-y-1">
              {PROBLEMS.map((p, i) => {
                const Icon = IconFor(p.severity);
                return (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono">
                    <Icon size={13} className={`shrink-0 mt-0.5 ${colorFor(p.severity)}`} />
                    <span className="text-gray-300">{p.message}</span>
                    <span className="text-gray-500 ml-auto shrink-0">{p.file}</span>
                    <span className="text-gray-600 shrink-0">{p.code}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dismiss helper badge if closed */}
      {!open && (
        <div className="hidden"><X size={10} /></div>
      )}
    </div>
  );
}
