import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'dark' | 'light' | 'monokai' | 'dracula' | 'solarized';
export type FontSize = 'sm' | 'md' | 'lg';

export interface Settings {
  theme: ThemeId;
  fontSize: FontSize;
  animations: boolean;
  typingSounds: boolean;
  showProblemsPanel: boolean;
  showMinimap: boolean;
  compactMode: boolean;
  zenMode: boolean;
  lineNumbers: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  fontSize: 'md',
  animations: true,
  typingSounds: false,
  showProblemsPanel: true,
  showMinimap: false,
  compactMode: false,
  zenMode: false,
  lineNumbers: true,
};

const STORAGE_KEY = 'portfolio-settings';

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsContextValue {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  // Persist + apply to <html> root
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-font-size', settings.fontSize);
    root.setAttribute('data-animations', settings.animations ? 'on' : 'off');
    root.setAttribute('data-compact', settings.compactMode ? 'on' : 'off');
    root.setAttribute('data-zen', settings.zenMode ? 'on' : 'off');
  }, [settings]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => setSettings(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
