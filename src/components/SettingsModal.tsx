import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, X, RotateCcw, Check, Palette, Type, Zap, Volume2, AlertTriangle, Map, Minimize2, Focus, Hash, Keyboard } from 'lucide-react';
import { useSettings, type ThemeId, type FontSize } from '../contexts/SettingsContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onTriggerHack?: () => void;
}

const THEMES: Array<{ id: ThemeId; name: string; swatches: string[] }> = [
  { id: 'dark',      name: 'Dark+ (default)', swatches: ['#111827', '#1f2937', '#4ade80', '#22d3ee'] },
  { id: 'light',     name: 'Light+',          swatches: ['#ffffff', '#f3f4f6', '#059669', '#0891b2'] },
  { id: 'monokai',   name: 'Monokai',         swatches: ['#272822', '#2d2e27', '#a6e22e', '#66d9ef'] },
  { id: 'dracula',   name: 'Dracula',         swatches: ['#282a36', '#343746', '#50fa7b', '#bd93f9'] },
  { id: 'solarized', name: 'Solarized Dark',  swatches: ['#002b36', '#073642', '#859900', '#268bd2'] },
];

const FONT_SIZES: Array<{ id: FontSize; label: string }> = [
  { id: 'sm', label: 'Small' },
  { id: 'md', label: 'Medium' },
  { id: 'lg', label: 'Large' },
];

export default function SettingsModal({ open, onClose, onTriggerHack }: Props) {
  const { settings, update, reset } = useSettings();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-100 bg-black/60 backdrop-blur-terminal flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] bg-gray-800 border border-gray-600 rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center gap-2">
                <SettingsIcon size={16} className="text-cyan-400" />
                <span className="text-white font-bold">Settings</span>
                <span className="text-gray-500 text-xs">settings.json</span>
              </div>
              <button
                onClick={onClose}
                title="Close (Esc)"
                className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Theme picker */}
              <Section icon={Palette} title="Color Theme" hint="Workbench · colorTheme">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {THEMES.map(t => {
                    const active = settings.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => update('theme', t.id)}
                        className={`flex items-center gap-3 p-3 rounded border-2 transition-all text-left cursor-pointer ${
                          active
                            ? 'border-cyan-400 bg-gray-900'
                            : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                        }`}
                      >
                        {/* Preview swatches */}
                        <div className="flex -space-x-1 shrink-0">
                          {t.swatches.map((c, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-full border-2 border-gray-800"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <span className="flex-1 text-sm text-white">{t.name}</span>
                        {active && <Check size={14} className="text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Font size */}
              <Section icon={Type} title="Font Size" hint="Editor · fontSize">
                <div className="flex gap-2">
                  {FONT_SIZES.map(f => {
                    const active = settings.fontSize === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => update('fontSize', f.id)}
                        className={`flex-1 py-2 px-3 rounded border-2 text-sm cursor-pointer transition-all ${
                          active
                            ? 'border-cyan-400 bg-gray-900 text-white'
                            : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Workbench toggles */}
              <Section icon={Zap} title="Workbench">
                <div className="space-y-1 bg-gray-900 rounded border border-gray-700 p-1">
                  <Toggle
                    icon={Zap}
                    label="Enable animations"
                    hint="Transitions and motion effects across the app"
                    checked={settings.animations}
                    onChange={v => update('animations', v)}
                  />
                  <Toggle
                    icon={Volume2}
                    label="Typing sounds"
                    hint="Mechanical keyboard clicks on every keypress"
                    checked={settings.typingSounds}
                    onChange={v => update('typingSounds', v)}
                  />
                  <Toggle
                    icon={Minimize2}
                    label="Compact mode"
                    hint="Tighter spacing across all cards"
                    checked={settings.compactMode}
                    onChange={v => update('compactMode', v)}
                  />
                  <Toggle
                    icon={Focus}
                    label="Zen mode"
                    hint="Hide activity bar, sidebar, and tabs for focused reading"
                    checked={settings.zenMode}
                    onChange={v => update('zenMode', v)}
                  />
                </div>
              </Section>

              {/* Editor toggles */}
              <Section icon={Type} title="Editor">
                <div className="space-y-1 bg-gray-900 rounded border border-gray-700 p-1">
                  <Toggle
                    icon={Hash}
                    label="Line numbers"
                    hint="Show line numbers in code blocks"
                    checked={settings.lineNumbers}
                    onChange={v => update('lineNumbers', v)}
                  />
                  <Toggle
                    icon={AlertTriangle}
                    label="Show problems panel"
                    hint="Collapsible strip above the status bar"
                    checked={settings.showProblemsPanel}
                    onChange={v => update('showProblemsPanel', v)}
                  />
                  <Toggle
                    icon={Map}
                    label="Show minimap"
                    hint="Zoomed-out preview of the current view"
                    checked={settings.showMinimap}
                    onChange={v => update('showMinimap', v)}
                  />
                </div>
              </Section>

              {/* Keyboard shortcuts */}
              <Section icon={Keyboard} title="Keyboard Shortcuts" hint="keybindings.json">
                <div className="bg-gray-900 rounded border border-gray-700 divide-y divide-gray-800">
                  {[
                    { label: 'Command Palette',       keys: ['Ctrl', 'Shift', 'P'] },
                    { label: 'Quick File Switcher',   keys: ['Ctrl', 'P']          },
                    { label: 'Open Settings',         keys: ['Ctrl', ',']          },
                    { label: 'Toggle Sidebar',        keys: ['Ctrl', 'B']          },
                    { label: 'Go to README',          keys: ['Ctrl', '1']          },
                    { label: 'Go to Experience',      keys: ['Ctrl', '2']          },
                    { label: 'Go to Skills',          keys: ['Ctrl', '3']          },
                    { label: 'Go to Projects',        keys: ['Ctrl', '4']          },
                    { label: 'Go to Contact',         keys: ['Ctrl', '5']          },
                    { label: 'Close modals',          keys: ['Esc']                },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between px-3 py-2 text-xs">
                      <span className="text-gray-300">{s.label}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k, i) => (
                          <kbd key={i} className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-[10px] text-gray-300 font-mono">{k}</kbd>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Secret — clickable to trigger directly */}
                  <button
                    onClick={() => { onClose(); setTimeout(() => onTriggerHack?.(), 180); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs bg-transparent border-none cursor-pointer hover:bg-red-900/20 group transition-colors"
                  >
                    <span className="text-red-400 group-hover:text-red-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Secret · <span className="text-gray-500 italic">click to trigger</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'].map((k, i) => (
                        <kbd key={i} className="bg-gray-800 border border-red-500/40 px-1.5 py-0.5 rounded text-[10px] text-red-300 font-mono group-hover:border-red-500 transition-colors">{k}</kbd>
                      ))}
                    </div>
                  </button>
                </div>
              </Section>

              {/* About */}
              <Section title="About">
                <div className="bg-gray-900 rounded border border-gray-700 p-4 space-y-1 text-xs">
                  <Row k="portfolio"    v="v2.1.0"                  />
                  <Row k="framework"    v="React 18 · Vite · TS"    />
                  <Row k="styling"      v="Tailwind CSS v4"         />
                  <Row k="author"       v="Ahmad Al-Ghawi"          />
                  <Row k="license"      v="MIT"                     />
                </div>
              </Section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 bg-gray-900">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
              >
                <RotateCcw size={12} /> Reset to defaults
              </button>
              <div className="text-xs text-gray-500">
                changes save automatically
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── helper subcomponents ─── */
function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={14} className="text-cyan-400" />}
        <span className="text-white text-sm font-bold">{title}</span>
        {hint && <span className="text-gray-500 text-xs ml-auto font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  hint,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800/60 cursor-pointer bg-transparent border-none text-left transition-colors"
    >
      <Icon size={14} className={checked ? 'text-cyan-400' : 'text-gray-500'} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white">{label}</div>
        {hint && <div className="text-xs text-gray-500">{hint}</div>}
      </div>
      <span
        className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
          checked ? 'bg-cyan-500' : 'bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
            checked ? 'left-4' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex">
      <span className="text-cyan-400 w-24 shrink-0">{k}:</span>
      <span className="text-gray-300">{v}</span>
    </div>
  );
}
