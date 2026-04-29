/**
 * AdminLayout — the admin shell.
 *
 * Top bar (sign-out, user info), left nav (collections), main content area.
 * All children routes render via <Outlet/>.
 */
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  Sparkles,
  Inbox,
  FileText,
  LogOut,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';
import { ToastViewport } from '../../components/admin/toast';

const nav = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutDashboard, end: true  },
  { to: '/admin/projects',     label: 'Projects',     icon: FolderKanban,    end: false },
  { to: '/admin/experience',   label: 'Experience',   icon: Briefcase,       end: false },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, end: false },
  { to: '/admin/now',          label: 'Now',          icon: Sparkles,        end: false },
  { to: '/admin/cv',           label: 'CV',           icon: FileText,        end: false },
  { to: '/admin/messages',     label: 'Messages',     icon: Inbox,           end: false },
  { to: '/admin/settings',     label: 'Settings',     icon: Settings,        end: false },
];

const THEME_MAP: Record<string, {
  bg: string; text: string; sidebarBg: string; sidebarBorder: string;
  activeNav: string; hoverNav: string; inactiveNav: string;
  accentText: string; accentDot: string;
}> = {
  dark:    { bg: 'bg-zinc-950',    text: 'text-zinc-100',    sidebarBg: 'bg-zinc-950/50',    sidebarBorder: 'border-zinc-900',    activeNav: 'bg-cyan-500/10 text-cyan-300', hoverNav: 'hover:text-zinc-200 hover:bg-zinc-900/50', inactiveNav: 'text-zinc-400', accentText: 'text-cyan-400', accentDot: 'bg-cyan-400' },
  light:   { bg: 'bg-gray-50',     text: 'text-gray-900',    sidebarBg: 'bg-white',            sidebarBorder: 'border-gray-200',    activeNav: 'bg-blue-500/10 text-blue-700', hoverNav: 'hover:text-gray-900 hover:bg-gray-100',   inactiveNav: 'text-gray-500', accentText: 'text-blue-600', accentDot: 'bg-blue-500' },
  blue:    { bg: 'bg-zinc-950',    text: 'text-zinc-100',    sidebarBg: 'bg-zinc-950/50',    sidebarBorder: 'border-zinc-900',    activeNav: 'bg-blue-500/10 text-blue-300', hoverNav: 'hover:text-zinc-200 hover:bg-zinc-900/50', inactiveNav: 'text-zinc-400', accentText: 'text-blue-400', accentDot: 'bg-blue-400' },
  green:   { bg: 'bg-zinc-950',    text: 'text-zinc-100',    sidebarBg: 'bg-zinc-950/50',    sidebarBorder: 'border-zinc-900',    activeNav: 'bg-emerald-500/10 text-emerald-300', hoverNav: 'hover:text-zinc-200 hover:bg-zinc-900/50', inactiveNav: 'text-zinc-400', accentText: 'text-emerald-400', accentDot: 'bg-emerald-400' },
  purple:  { bg: 'bg-zinc-950',    text: 'text-zinc-100',    sidebarBg: 'bg-zinc-950/50',    sidebarBorder: 'border-zinc-900',    activeNav: 'bg-violet-500/10 text-violet-300', hoverNav: 'hover:text-zinc-200 hover:bg-zinc-900/50', inactiveNav: 'text-zinc-400', accentText: 'text-violet-400', accentDot: 'bg-violet-400' },
};

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { settings } = useAdminSettings();
  const navigate = useNavigate();
  const t = THEME_MAP[settings.theme] ?? THEME_MAP.dark;

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className={`min-h-screen flex ${t.bg} ${t.text}`}>
      {/* Sidebar */}
      <aside className={`w-60 shrink-0 border-r flex flex-col ${t.sidebarBorder} ${t.sidebarBg}`}>
        <div className={`px-5 py-5 border-b ${t.sidebarBorder}`}>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className={`inline-block w-2 h-2 rounded-full ${t.accentDot}`} />
            Portfolio CMS
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? t.activeNav
                    : `${t.inactiveNav} ${t.hoverNav}`
                }`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={`p-3 border-t space-y-1 ${t.sidebarBorder}`}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${t.inactiveNav} ${t.hoverNav}`}
          >
            <ExternalLink size={15} />
            <span>View site</span>
          </a>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer bg-transparent border-none ${t.inactiveNav} hover:text-red-300 hover:bg-red-500/5`}
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  );
}
