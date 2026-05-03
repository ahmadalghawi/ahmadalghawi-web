/**
 * AdminSettings — admin-side settings page.
 *
 * Reuses the shared SettingsContext so changes apply to the public site
 * immediately (theme toggles on <html> root, persisted to localStorage).
 */
import { useAdminSettings } from '../../contexts/AdminSettingsContext';
import type { AdminTheme } from '../../lib/admin-settings';
import {
  Palette,
  RotateCcw,
  Moon,
  Sun,
  Coffee,
  Check,
  PanelLeftClose,
  TableProperties,
} from 'lucide-react';
import { PageHeader } from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';

const THEMES: Array<{ id: AdminTheme; name: string; swatches: string[]; icon: typeof Moon | typeof Sun }> = [
  { id: 'dark',    name: 'Dark',    swatches: ['#18181b', '#27272a', '#22d3ee', '#a1a1aa'], icon: Moon },
  { id: 'warm',    name: 'Warm',    swatches: ['#fffbeb', '#fde68a', '#ea580c', '#92400e'], icon: Coffee },
  { id: 'light',   name: 'Light',   swatches: ['#f8fafc', '#e2e8f0', '#2563eb', '#475569'], icon: Sun },
  { id: 'blue',    name: 'Blue',    swatches: ['#0f172a', '#1e293b', '#3b82f6', '#94a3b8'], icon: Moon },
  { id: 'green',   name: 'Green',   swatches: ['#022c22', '#064e3b', '#10b981', '#a1a1aa'], icon: Moon },
  { id: 'purple',  name: 'Purple',  swatches: ['#2e1065', '#4c1d95', '#8b5cf6', '#a1a1aa'], icon: Moon },
];

/**
 * Per-theme Tailwind class tokens for the settings page chrome.
 * Keeps text/panels readable on light + warm without overhauling every admin page.
 */
interface Tokens {
  panel: string;        // base card bg + border
  panelHover: string;   // hover ring on cards
  panelActive: string;  // selected theme card highlight
  heading: string;      // h2 / labels
  body: string;         // primary body text
  muted: string;        // hints / descriptions
  divider: string;      // section <hr> border
  toggleOff: string;    // off-state pill bg
  resetBtn: string;
  accent: string;       // check icon + active accent
}

const TOKENS: Record<AdminTheme, Tokens> = {
  dark:   { panel: 'bg-zinc-900 border-zinc-800',           panelHover: 'hover:border-zinc-700',  panelActive: 'border-cyan-500/50 bg-cyan-500/5',     heading: 'text-zinc-200', body: 'text-zinc-200', muted: 'text-zinc-500', divider: 'border-zinc-800',  toggleOff: 'bg-zinc-700',  resetBtn: 'bg-zinc-900 border-zinc-800 hover:border-red-500/40 hover:bg-red-500/5 text-zinc-400 hover:text-red-300', accent: 'text-cyan-300' },
  light:  { panel: 'bg-white border-slate-200',             panelHover: 'hover:border-slate-300', panelActive: 'border-blue-500 bg-blue-50',           heading: 'text-slate-900', body: 'text-slate-900', muted: 'text-slate-600', divider: 'border-slate-200', toggleOff: 'bg-slate-300', resetBtn: 'bg-white border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-700',                accent: 'text-blue-600' },
  warm:   { panel: 'bg-orange-50/60 border-amber-200',     panelHover: 'hover:border-amber-300', panelActive: 'border-orange-500 bg-orange-100/60',  heading: 'text-amber-950', body: 'text-amber-950', muted: 'text-amber-800', divider: 'border-amber-200', toggleOff: 'bg-amber-300', resetBtn: 'bg-orange-50/60 border-amber-200 hover:border-red-300 hover:bg-red-50 text-amber-900 hover:text-red-700',     accent: 'text-orange-700' },
  blue:   { panel: 'bg-zinc-900 border-zinc-800',           panelHover: 'hover:border-zinc-700',  panelActive: 'border-blue-500/50 bg-blue-500/5',     heading: 'text-zinc-200', body: 'text-zinc-200', muted: 'text-zinc-500', divider: 'border-zinc-800',  toggleOff: 'bg-zinc-700',  resetBtn: 'bg-zinc-900 border-zinc-800 hover:border-red-500/40 hover:bg-red-500/5 text-zinc-400 hover:text-red-300', accent: 'text-blue-300' },
  green:  { panel: 'bg-zinc-900 border-zinc-800',           panelHover: 'hover:border-zinc-700',  panelActive: 'border-emerald-500/50 bg-emerald-500/5', heading: 'text-zinc-200', body: 'text-zinc-200', muted: 'text-zinc-500', divider: 'border-zinc-800',  toggleOff: 'bg-zinc-700',  resetBtn: 'bg-zinc-900 border-zinc-800 hover:border-red-500/40 hover:bg-red-500/5 text-zinc-400 hover:text-red-300', accent: 'text-emerald-300' },
  purple: { panel: 'bg-zinc-900 border-zinc-800',           panelHover: 'hover:border-zinc-700',  panelActive: 'border-violet-500/50 bg-violet-500/5', heading: 'text-zinc-200', body: 'text-zinc-200', muted: 'text-zinc-500', divider: 'border-zinc-800',  toggleOff: 'bg-zinc-700',  resetBtn: 'bg-zinc-900 border-zinc-800 hover:border-red-500/40 hover:bg-red-500/5 text-zinc-400 hover:text-red-300', accent: 'text-violet-300' },
};

export default function AdminSettings() {
  const { settings, update, reset } = useAdminSettings();
  const tk = TOKENS[settings.theme] ?? TOKENS.dark;
  // Inner ring color on swatch dots needs to match the panel bg so the dots
  // “nest” cleanly on light + warm (border-zinc-900 looks ugly on white).
  const swatchRing =
    settings.theme === 'light' ? 'border-white' :
    settings.theme === 'warm'  ? 'border-orange-50' :
                                 'border-zinc-900';

  function handleReset() {
    if (!window.confirm('Reset all settings to defaults?')) return;
    reset();
    pushToast('success', 'Settings reset to defaults');
  }

  return (
    <div className="p-8 max-w-4xl">
      <PageHeader title="Admin Settings" description="Customize the admin panel appearance" />

      {/* Theme picker */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className={tk.accent} />
          <h2 className={`text-sm font-semibold ${tk.heading}`}>Admin Theme</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const active = settings.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => update('theme', t.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  active ? tk.panelActive : `${tk.panel} ${tk.panelHover}`
                }`}
              >
                <div className="flex -space-x-1 shrink-0">
                  {t.swatches.map((c, i) => (
                    <span key={i} className={`w-5 h-5 rounded-full border-2 ${swatchRing}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className={`flex-1 text-sm ${tk.body}`}>{t.name}</span>
                {active && <Check size={14} className={`${tk.accent} shrink-0`} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Layout toggles */}
      <section className="mt-8">
        <div className="space-y-2 max-w-xl">
          <ToggleRow
            icon={PanelLeftClose}
            label="Collapse sidebar"
            hint="Start with the sidebar collapsed"
            checked={settings.sidebarCollapsed}
            onChange={() => update('sidebarCollapsed', !settings.sidebarCollapsed)}
            tk={tk}
          />
          <ToggleRow
            icon={TableProperties}
            label="Dense tables"
            hint="Tighter row spacing in list views"
            checked={settings.denseTables}
            onChange={() => update('denseTables', !settings.denseTables)}
            tk={tk}
          />
        </div>
      </section>

      {/* Reset */}
      <section className={`mt-8 pt-6 border-t ${tk.divider}`}>
        <button
          onClick={handleReset}
          className={`inline-flex items-center gap-2 text-xs border px-3 py-2 rounded-md transition-colors cursor-pointer ${tk.resetBtn}`}
        >
          <RotateCcw size={13} />
          Reset admin settings
        </button>
      </section>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  hint,
  checked,
  onChange,
  tk,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
  tk: Tokens;
}) {
  return (
    <button
      onClick={onChange}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all cursor-pointer ${tk.panel} ${tk.panelHover}`}
    >
      <Icon size={14} className={checked ? tk.accent : tk.muted} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${tk.body}`}>{label}</div>
        <div className={`text-xs ${tk.muted}`}>{hint}</div>
      </div>
      <span
        className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
          checked ? 'bg-cyan-500' : tk.toggleOff
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
            checked ? 'left-4' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}
