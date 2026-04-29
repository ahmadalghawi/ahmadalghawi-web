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
  Check,
  PanelLeftClose,
  TableProperties,
} from 'lucide-react';
import { PageHeader } from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';

const THEMES: Array<{ id: AdminTheme; name: string; swatches: string[]; icon: typeof Moon | typeof Sun }> = [
  { id: 'dark',    name: 'Dark',    swatches: ['#18181b', '#27272a', '#22d3ee', '#a1a1aa'], icon: Moon },
  { id: 'light',   name: 'Light',   swatches: ['#fafafa', '#e4e4e7', '#3b82f6', '#71717a'], icon: Sun },
  { id: 'blue',    name: 'Blue',    swatches: ['#0f172a', '#1e293b', '#3b82f6', '#94a3b8'], icon: Moon },
  { id: 'green',   name: 'Green',   swatches: ['#022c22', '#064e3b', '#10b981', '#a1a1aa'], icon: Moon },
  { id: 'purple',  name: 'Purple',  swatches: ['#2e1065', '#4c1d95', '#8b5cf6', '#a1a1aa'], icon: Moon },
];

export default function AdminSettings() {
  const { settings, update, reset } = useAdminSettings();

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
          <Palette size={16} className="text-cyan-300" />
          <h2 className="text-sm font-semibold text-zinc-200">Admin Theme</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const active = settings.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => update('theme', t.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  active
                    ? 'border-cyan-500/50 bg-cyan-500/5'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex -space-x-1 shrink-0">
                  {t.swatches.map((c, i) => (
                    <span key={i} className="w-5 h-5 rounded-full border-2 border-zinc-900" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="flex-1 text-sm text-zinc-200">{t.name}</span>
                {active && <Check size={14} className="text-cyan-300 shrink-0" />}
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
          />
          <ToggleRow
            icon={TableProperties}
            label="Dense tables"
            hint="Tighter row spacing in list views"
            checked={settings.denseTables}
            onChange={() => update('denseTables', !settings.denseTables)}
          />
        </div>
      </section>

      {/* Reset */}
      <section className="mt-8 pt-6 border-t border-zinc-800">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 hover:border-red-500/40 hover:bg-red-500/5 text-zinc-400 hover:text-red-300 px-3 py-2 rounded-md transition-colors cursor-pointer"
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
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-left transition-all cursor-pointer"
    >
      <Icon size={14} className={checked ? 'text-cyan-300' : 'text-zinc-500'} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-200">{label}</div>
        <div className="text-xs text-zinc-500">{hint}</div>
      </div>
      <span
        className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
          checked ? 'bg-cyan-500' : 'bg-zinc-700'
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
