import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onDone: () => void;
}

/* ═══════════════════════════════════════════════════════════════
   HACKER MODE — full-screen cinematic hacking sequence
   Triggered by the Konami code (↑ ↑ ↓ ↓ ← → ← → B A)
   ═══════════════════════════════════════════════════════════════ */

const HACK_LINES: Array<{ text: string; delay: number; color?: string }> = [
  { text: '[SYS] Initializing hack.exe v4.2.0...',           delay: 80,  color: 'text-gray-400'  },
  { text: '[NET] Establishing secure tunnel via tor://',     delay: 90  },
  { text: '[AUTH] Bypassing biometric lock...',              delay: 100 },
  { text: '    > SSH handshake: OK',                         delay: 60,  color: 'text-gray-500'  },
  { text: '    > TLS 1.3 negotiated',                        delay: 60,  color: 'text-gray-500'  },
  { text: '    > IP masked via 7 proxies',                   delay: 60,  color: 'text-gray-500'  },
  { text: '[SCAN] Probing target: portfolio.ahmad-dev.com',  delay: 120 },
  { text: '    > Port 22   : OPEN',                          delay: 50,  color: 'text-gray-500'  },
  { text: '    > Port 80   : OPEN',                          delay: 50,  color: 'text-gray-500'  },
  { text: '    > Port 443  : OPEN',                          delay: 50,  color: 'text-gray-500'  },
  { text: '    > Port 1337 : HIDDEN',                        delay: 70,  color: 'text-yellow-400' },
  { text: '[EXPLOIT] CVE-2024-∞ detected — injecting...',    delay: 140, color: 'text-orange-400' },
  { text: '[CRACK] Brute-forcing root password',             delay: 100 },
  { text: '    > Attempt #1237: ********** MATCH',           delay: 80,  color: 'text-green-400' },
  { text: '[PWND] Root access granted.',                     delay: 120, color: 'text-red-400'   },
  { text: '[GREP] Scanning filesystem for secrets...',       delay: 110 },
  { text: '    > /etc/shadow .................. [OK]',       delay: 60,  color: 'text-gray-500'  },
  { text: '    > /home/ahmad/secrets.env ...... [OK]',       delay: 60,  color: 'text-gray-500'  },
  { text: '    > /var/log/hire-me.log ......... [FOUND]',    delay: 80,  color: 'text-cyan-400'  },
  { text: '[EXTRACT] Retrieving profile data...',            delay: 100 },
  { text: '    NAME    : Ahmad Al-Ghawi',                    delay: 60,  color: 'text-cyan-400'  },
  { text: '    ROLE    : Senior Full Stack & AI Engineer',   delay: 60,  color: 'text-cyan-400'  },
  { text: '    EMAIL   : Ahmadalghawi.86@gmail.com',         delay: 60,  color: 'text-cyan-400'  },
  { text: '    STATUS  : AVAILABLE FOR HIRE',                delay: 80,  color: 'text-green-400' },
  { text: '[DONE] Mission accomplished. Clearing tracks...', delay: 140, color: 'text-green-400' },
];

/* ──────────────── Matrix rain canvas ──────────────── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=#<>[]{}'.split('');
    const fontSize = 14;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * height / fontSize);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading character is brighter
        ctx.fillStyle = Math.random() < 0.02 ? '#ffffff' : '#00ff66';
        ctx.fillText(ch, x, y);

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ──────────────── Progress bar ──────────────── */
function ProgressBar({ label, duration, color }: { label: string; duration: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-mono">
        <span className="text-gray-400">{label}</span>
        <motion.span
          className={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: duration / 1000 - 0.2 }}
        >
          COMPLETE
        </motion.span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );
}

/* ──────────────── Main component ──────────────── */
export default function HackerMode({ onDone }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Reveal lines progressively
  useEffect(() => {
    if (visibleLines >= HACK_LINES.length) {
      const t = setTimeout(() => setShowAccessGranted(true), 300);
      return () => clearTimeout(t);
    }
    const line = HACK_LINES[visibleLines];
    const t = setTimeout(() => setVisibleLines(n => n + 1), line.delay);
    return () => clearTimeout(t);
  }, [visibleLines]);

  // Autoscroll log
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleLines]);

  // Allow Esc / click / Enter to dismiss
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  // Auto-dismiss after 12s total
  useEffect(() => {
    const t = setTimeout(onDone, 12000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onDone}
      className="fixed inset-0 z-200 bg-black font-mono cursor-pointer overflow-hidden"
    >
      {/* Matrix rain background */}
      <div className="absolute inset-0 opacity-50">
        <MatrixRain />
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] scanlines" />

      {/* Glitch flash on launch */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0, 1, 0] }}
        transition={{ duration: 0.6, times: [0, 0.1, 0.3, 0.5, 0.9] }}
        className="absolute inset-0 bg-green-500 pointer-events-none"
      />

      {/* Content grid */}
      <div className="relative z-10 h-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ─── Left: hack log (spans 2 cols) ─── */}
        <div className="lg:col-span-2 bg-black/70 border border-green-500/50 rounded-lg p-4 backdrop-blur-terminal flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-500/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">● REC LIVE INTRUSION</span>
            </div>
            <span className="text-green-400 text-xs">root@target:~#</span>
          </div>

          <div ref={logRef} className="flex-1 overflow-y-auto space-y-0.5 text-[12px] leading-relaxed">
            {HACK_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.12 }}
                className={line.color ?? 'text-green-400'}
              >
                {line.text}
              </motion.div>
            ))}
            {visibleLines < HACK_LINES.length && (
              <span className="inline-block w-2 h-3 bg-green-400 animate-pulse align-middle" />
            )}
          </div>
        </div>

        {/* ─── Right: system info + progress ─── */}
        <div className="space-y-3 min-h-0 flex flex-col">
          {/* Target info */}
          <div className="bg-black/70 border border-green-500/50 rounded-lg p-4 backdrop-blur-terminal">
            <div className="text-red-400 text-xs font-bold mb-2 uppercase tracking-wider">// TARGET</div>
            <div className="space-y-0.5 text-[11px]">
              <InfoRow k="host"     v="portfolio.ahmad-dev.com" />
              <InfoRow k="ip"       v="192.168.1.337" />
              <InfoRow k="os"       v="Linux 5.15 (sekure)" />
              <InfoRow k="uptime"   v="1337 days, 04:20" />
              <InfoRow k="cpu"      v="Intel Quantum™ 9.0GHz" />
              <InfoRow k="mem"      v="64GB / 128GB" />
            </div>
          </div>

          {/* Progress bars */}
          <div className="bg-black/70 border border-green-500/50 rounded-lg p-4 backdrop-blur-terminal space-y-3">
            <div className="text-red-400 text-xs font-bold mb-1 uppercase tracking-wider">// EXPLOIT CHAIN</div>
            <ProgressBar label="Firewall bypass"   duration={2000} color="text-green-400"  />
            <ProgressBar label="Root escalation"   duration={3500} color="text-yellow-400" />
            <ProgressBar label="Payload injection" duration={5000} color="text-orange-400" />
            <ProgressBar label="Data exfiltration" duration={7000} color="text-red-400"    />
          </div>

          {/* Random packet stream */}
          <div className="bg-black/70 border border-green-500/50 rounded-lg p-4 backdrop-blur-terminal flex-1 min-h-0 overflow-hidden">
            <div className="text-red-400 text-xs font-bold mb-2 uppercase tracking-wider">// PACKET STREAM</div>
            <div className="text-green-400 text-[10px] leading-tight opacity-70 overflow-hidden">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.6, 0] }}
                  transition={{ duration: 2, delay: i * 0.12, repeat: Infinity, repeatDelay: 0.5 }}
                >
                  {Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(' ')}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── ACCESS GRANTED reveal ─── */}
      <AnimatePresence>
        {showAccessGranted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            {/* Huge glitch title */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="text-center px-6"
            >
              <motion.div
                animate={{ x: [0, -3, 3, -2, 0], opacity: [1, 0.7, 1, 0.9, 1] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.5 }}
                className="text-green-400 text-6xl md:text-8xl font-black tracking-tight leading-none mb-4"
                style={{ textShadow: '0 0 12px #4ade80, 0 0 2px #22d3ee' }}
              >
                ACCESS GRANTED
              </motion.div>

              <div className="text-cyan-400 text-sm md:text-base mb-6">
                &gt; Identity confirmed: <span className="text-white">Ahmad Al-Ghawi</span>
              </div>

              {/* ASCII skull */}
              <pre className="text-green-400 text-[10px] md:text-xs leading-tight inline-block text-left bg-black/60 border border-green-500/40 rounded p-4 shadow-2xl">
{`         ___          ___
       /'___\\        /\\_ \\
      /\\ \\__/  __  __\\//\\ \\     ___
      \\ \\ ,__\\/\\ \\/\\ \\ \\ \\ \\   /'___\\
       \\ \\ \\_/\\ \\ \\_\\ \\ \\_\\ \\_/\\ \\__/
        \\ \\_\\  \\ \\____/ /\\____\\ \\____\\
         \\/_/   \\/___/  \\/____/\\/____/

              YOU FOUND THE EASTER EGG
              ───────────────────────
              hire-command: unlocked
              → try:  sudo hire-me`}
              </pre>

              <div className="mt-6 text-gray-500 text-xs animate-pulse">
                press ESC · ENTER · or click anywhere to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top corner badge */}
      <div className="absolute top-4 right-4 z-30 text-right font-mono">
        <div className="text-red-400 text-xs animate-pulse">● CONNECTION ENCRYPTED</div>
        <div className="text-gray-500 text-[10px]">press Esc to abort</div>
      </div>
    </motion.div>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex">
      <span className="text-green-400/70 w-14 shrink-0">{k}:</span>
      <span className="text-green-400">{v}</span>
    </div>
  );
}
