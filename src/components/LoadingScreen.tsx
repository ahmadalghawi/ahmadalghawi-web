import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\;:';

const BOOT_LINES = [
  { text: 'BIOS v2.0.26 — Ahmad Al-Ghawi Portfolio System', delay: 0 },
  { text: 'Initializing memory modules... OK', delay: 180 },
  { text: 'Loading kernel: react@19 + vite@8... OK', delay: 360 },
  { text: 'Mounting filesystem: portfolio-main/', delay: 540 },
  { text: '  README.md          [loaded]', delay: 680 },
  { text: '  experience.json    [loaded]', delay: 780 },
  { text: '  skills.js          [loaded]', delay: 880 },
  { text: '  projects.tsx       [loaded]', delay: 980 },
  { text: '  contact.env        [loaded]', delay: 1080 },
  { text: 'Starting developer environment... OK', delay: 1280 },
  { text: '> npm start --portfolio', delay: 1500 },
  { text: '', delay: 1650 },
  { text: '✓ Ready — Welcome to Ahmad\'s Developer Playground 🚀', delay: 1750, highlight: true },
];

function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    let cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cols = Math.floor(canvas.width / fontSize);
      while (drops.length < cols) drops.push(Math.random() * -100);

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random();
        if (brightness > 0.98) {
          ctx.fillStyle = '#ffffff';
        } else if (brightness > 0.92) {
          ctx.fillStyle = '#86efac';
        } else {
          ctx.fillStyle = '#16a34a';
        }

        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function LoadingScreen() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay);
    });
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-black font-mono overflow-hidden z-50 flex items-center justify-center"
      >
        {/* Matrix rain background */}
        <MatrixCanvas />

        {/* Dark overlay so terminal is readable */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative z-10 w-full max-w-2xl mx-4"
        >
          {/* Terminal title bar */}
          <div className="bg-gray-800 border border-gray-600 rounded-t-lg px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400 text-xs ml-3">bash — portfolio.dev — 80×24</span>
          </div>

          {/* Terminal body */}
          <div
            className="bg-black/90 border border-t-0 border-gray-600 rounded-b-lg px-6 py-5 min-h-64 backdrop-blur-terminal"
          >
            {BOOT_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.15 }}
                className={`text-sm leading-6${line.highlight ? ' glow-green' : ''}`}
                style={{
                  color: line.highlight ? '#4ade80' : i === 10 ? '#facc15' : '#6b7280',
                  fontWeight: line.highlight ? 700 : 400,
                }}
              >
                {line.text || '\u00A0'}
              </motion.div>
            ))}

            {/* Blinking cursor at end */}
            {visibleLines.length >= BOOT_LINES.length && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-green-400 text-sm">$</span>
                <span className="inline-block w-2 h-4 bg-green-400 cursor-blink ml-1" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
