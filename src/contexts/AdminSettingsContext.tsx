import { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_ADMIN_SETTINGS,
  loadAdminSettings,
  ADMIN_STORAGE_KEY,
} from '../lib/admin-settings';
import type { AdminSettings, AdminSettingsContextValue } from '../lib/admin-settings';

const AdminSettingsContext = createContext<AdminSettingsContextValue | null>(null);

export function AdminSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AdminSettings>(loadAdminSettings);

  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setSettings(DEFAULT_ADMIN_SETTINGS);

  return (
    <AdminSettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings(): AdminSettingsContextValue {
  const ctx = useContext(AdminSettingsContext);
  if (!ctx) throw new Error('useAdminSettings must be used inside <AdminSettingsProvider>');
  return ctx;
}
