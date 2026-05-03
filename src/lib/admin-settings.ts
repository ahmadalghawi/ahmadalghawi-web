export type AdminTheme = 'dark' | 'light' | 'warm' | 'blue' | 'green' | 'purple';

export interface AdminSettings {
  theme: AdminTheme;
  sidebarCollapsed: boolean;
  denseTables: boolean;
}

export interface AdminSettingsContextValue {
  settings: AdminSettings;
  update: <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => void;
  reset: () => void;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  theme: 'dark',
  sidebarCollapsed: false,
  denseTables: false,
};

export const ADMIN_STORAGE_KEY = 'portfolio-admin-settings';

export function loadAdminSettings(): AdminSettings {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_SETTINGS;
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}
