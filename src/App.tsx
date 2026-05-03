import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FileCode, Database, Code, Monitor, Mail, BookOpen, X, GitBranch, Bell, ChevronRight, Command, Menu } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import CommandPalette, { type PaletteCommand } from './components/CommandPalette';
import HackerMode from './components/HackerMode';
import ProblemsPanel from './components/ProblemsPanel';
import NotFound from './components/NotFound';
import SettingsModal from './components/SettingsModal';
import { SourceControlView, ExtensionsView, TerminalView } from './components/PanelViews';
import { useSettings } from './contexts/SettingsContext';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Blog from './components/sections/Blog';
import BlogPost from './components/sections/BlogPost';
import ProjectCaseStudy from './components/sections/ProjectCaseStudy';
import Contact from './components/sections/Contact';
import CV from './pages/CV';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminExperience from './pages/admin/AdminExperience';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminNow from './pages/admin/AdminNow';
import AdminCV from './pages/admin/AdminCV';
import AdminMessages from './pages/admin/AdminMessages';
import AdminBlog from './pages/admin/AdminBlog';
import AdminSettings from './pages/admin/AdminSettings';
import RequireAdmin from './components/admin/RequireAdmin';
import { AdminSettingsProvider } from './contexts/AdminSettingsContext';
import type { SectionId, PanelId } from './components/Sidebar';
import { useHotkeys } from './hooks/useHotkeys';
import { useKonami } from './hooks/useKonami';
import { useTypingSounds } from './hooks/useTypingSounds';
import { usePosts } from './hooks/usePosts';
import { useProjects } from './hooks/useProjects';
import GamesPage from './pages/Games';
import { games } from './games/registry';

const pathToSection: Record<string, SectionId> = {
  '/': 'about',
  '/experience': 'experience',
  '/skills': 'skills',
  '/projects': 'projects',
  '/blog': 'blog',
  '/contact': 'contact',
};

const tabs = [
  { id: 'about'      as SectionId, path: '/',           name: 'README',     icon: FileCode, ext: '.md',   lang: 'Markdown'         },
  { id: 'experience' as SectionId, path: '/experience', name: 'experience', icon: Database, ext: '.json', lang: 'JSON'             },
  { id: 'skills'     as SectionId, path: '/skills',     name: 'skills',     icon: Code,     ext: '.js',   lang: 'JavaScript'       },
  { id: 'projects'   as SectionId, path: '/projects',   name: 'projects',   icon: Monitor,  ext: '.tsx',  lang: 'TypeScript React' },
  { id: 'blog'       as SectionId, path: '/blog',       name: 'blog',       icon: BookOpen, ext: '.md',   lang: 'Markdown'         },
  { id: 'contact'    as SectionId, path: '/contact',    name: 'contact',    icon: Mail,     ext: '.env',  lang: 'dotenv'           },
];

function Breadcrumb({ activeSection, onToggleSidebar }: { activeSection: SectionId; onToggleSidebar: () => void }) {
  const tab = tabs.find(t => t.id === activeSection);
  return (
    <div className="flex items-center gap-1 px-4 py-1 bg-gray-800 border-b border-gray-700 text-xs font-mono text-gray-500 shrink-0">
      <button
        onClick={onToggleSidebar}
        title="Toggle sidebar (Ctrl+B)"
        className="md:hidden mr-2 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-0.5"
      >
        <Menu size={14} />
      </button>
      <span className="hover:text-gray-300 cursor-default">portfolio-main</span>
      <ChevronRight size={12} />
      <span className={tab ? 'text-gray-300' : ''}>{tab?.name}{tab?.ext}</span>
    </div>
  );
}

function TabBar({ activeSection, onFileClick }: { activeSection: SectionId; onFileClick: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-end bg-gray-900 border-b border-gray-700 overflow-x-auto shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => { onFileClick(); navigate(tab.path); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono cursor-pointer select-none shrink-0 border-r border-gray-700 transition-colors group ${
              isActive
                ? 'bg-gray-800 text-white border-t-2 border-t-cyan-400'
                : 'bg-gray-900 text-gray-500 hover:bg-gray-800 hover:text-gray-300 border-t-2 border-t-transparent'
            }`}
          >
            <Icon size={13} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
            <span>{tab.name}<span className="text-gray-600">{tab.ext}</span></span>
            <X
              size={12}
              className={`ml-1 opacity-0 group-hover:opacity-60 hover:opacity-100! transition-opacity ${isActive ? 'opacity-40' : ''}`}
            />
          </div>
        );
      })}
    </div>
  );
}

function StatusBar({ activeSection, onPaletteOpen }: { activeSection: SectionId; onPaletteOpen: () => void }) {
  const tab = tabs.find(t => t.id === activeSection);
  return (
    <div className="flex items-center justify-between px-3 h-6 bg-blue-700 text-white text-xs font-mono shrink-0 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <GitBranch size={11} />
          <span>main</span>
        </div>
        <span className="text-blue-200">0 errors · 0 warnings</span>
        <button
          onClick={onPaletteOpen}
          title="Open Command Palette"
          className="hidden sm:flex items-center gap-1 text-blue-200 hover:text-white bg-transparent border-none cursor-pointer"
        >
          <Command size={11} />
          <span>Ctrl+Shift+P</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden md:inline">Ln 1, Col 1</span>
        <span className="hidden md:inline">Spaces: 2</span>
        <span>UTF-8</span>
        <span>{tab?.lang}</span>
        <Bell size={11} />
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<PanelId>('explorer');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteMode, setPaletteMode] = useState<'full' | 'files'>('full');
  const [konamiActive, setKonamiActive] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, update } = useSettings();
  const { data: posts } = usePosts();
  const { data: projects } = useProjects();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    // If the user has no stored preference, default based on screen size
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) return stored === '1';
    return window.innerWidth < 768;
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', sidebarCollapsed ? '1' : '0');
  }, [sidebarCollapsed]);

  const activeSection: SectionId = location.pathname.startsWith('/blog')
    ? 'blog'
    : location.pathname.startsWith('/projects/')
    ? 'projects'
    : pathToSection[location.pathname] ?? 'about';

  // Build the command list for the palette
  const commands = useMemo<PaletteCommand[]>(() => {
    const navCommands: PaletteCommand[] = tabs.map((t, i) => ({
      id: `go:${t.id}`,
      label: `Go to ${t.name}${t.ext}`,
      group: 'File',
      hint: `Ctrl+${i + 1}`,
      action: () => navigate(t.path),
    }));

    const viewCommands: PaletteCommand[] = [
      {
        id: 'view:toggle-sidebar',
        label: sidebarCollapsed ? 'View: Show Sidebar' : 'View: Hide Sidebar',
        group: 'View',
        hint: 'Ctrl+B',
        action: () => setSidebarCollapsed(c => !c),
      },
    ];

    const actionCommands: PaletteCommand[] = [
      {
        id: 'action:copy-email',
        label: 'Copy email to clipboard',
        group: 'Action',
        action: () => navigator.clipboard.writeText('Ahmadalghawi.86@gmail.com'),
      },
      {
        id: 'action:open-github',
        label: 'Open GitHub profile',
        group: 'Action',
        action: () => window.open('https://github.com/ahmadalghawi', '_blank'),
      },
      {
        id: 'action:open-linkedin',
        label: 'Open LinkedIn profile',
        group: 'Action',
        action: () => window.open('https://www.linkedin.com/in/ahmad-alghawi-310722197/', '_blank'),
      },
    ];

    const prefCommands: PaletteCommand[] = [
      {
        id: 'pref:open-settings',
        label: 'Preferences: Open Settings',
        group: 'Preferences',
        hint: 'Ctrl+,',
        action: () => setSettingsOpen(true),
      },
      {
        id: 'pref:hacker-mode',
        label: 'Developer: Trigger Hacker Mode',
        group: 'Preferences',
        hint: '↑↑↓↓←→←→BA',
        action: () => setKonamiActive(true),
      },
      {
        id: 'pref:theme-dark',
        label: 'Theme: Dark+ (default)',
        group: 'Preferences',
        action: () => update('theme', 'dark'),
      },
      {
        id: 'pref:theme-light',
        label: 'Theme: Light+',
        group: 'Preferences',
        action: () => update('theme', 'light'),
      },
      {
        id: 'pref:theme-monokai',
        label: 'Theme: Monokai',
        group: 'Preferences',
        action: () => update('theme', 'monokai'),
      },
      {
        id: 'pref:theme-dracula',
        label: 'Theme: Dracula',
        group: 'Preferences',
        action: () => update('theme', 'dracula'),
      },
      {
        id: 'pref:theme-solarized',
        label: 'Theme: Solarized Dark',
        group: 'Preferences',
        action: () => update('theme', 'solarized'),
      },
    ];

    const postCommands: PaletteCommand[] = (posts ?? [])
      .filter((p) => p.published)
      .map((p) => ({
        id: `post:${p.slug}`,
        label: `Open post: ${p.title}`,
        group: 'Content',
        action: () => navigate(`/blog/${p.slug}`),
      }));

    const projectCommands: PaletteCommand[] = (projects ?? []).map((p) => ({
      id: `project:${p.id}`,
      label: `Open project: ${p.title}`,
      group: 'Content',
      action: () => navigate(`/projects/${p.id}`),
    }));

    const gameCommands: PaletteCommand[] = [
      {
        id: 'games:arcade',
        label: 'Open Arcade',
        group: 'Games',
        hint: 'mod+7',
        action: () => { setActivePanel('games'); navigate('/games'); },
      },
      ...games.map((g) => ({
        id: `game:${g.slug}`,
        label: `Play ${g.name}`,
        group: 'Games',
        action: () => { setActivePanel('games'); navigate(`/games/${g.slug}`); },
      })),
    ];

    return paletteMode === 'files'
      ? navCommands
      : [...navCommands, ...viewCommands, ...actionCommands, ...prefCommands, ...postCommands, ...projectCommands, ...gameCommands];
  }, [navigate, sidebarCollapsed, paletteMode, update, posts, projects]);

  useKonami(() => setKonamiActive(true));
  useTypingSounds(settings.typingSounds);

  // Keyboard shortcuts
  useHotkeys({
    'mod+shift+p': (e) => { e.preventDefault(); setPaletteMode('full'); setPaletteOpen(true); },
    'mod+p':       (e) => { e.preventDefault(); setPaletteMode('files'); setPaletteOpen(true); },
    'mod+b':       (e) => {
      e.preventDefault();
      // If Zen mode is on, exit it and reveal the sidebar (CSS `.zen-hide`
      // force-hides the sidebar otherwise, making the toggle look broken).
      if (settings.zenMode) {
        update('zenMode', false);
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(c => !c);
      }
    },
    'mod+1':       (e) => { e.preventDefault(); navigate('/'); },
    'mod+2':       (e) => { e.preventDefault(); navigate('/experience'); },
    'mod+3':       (e) => { e.preventDefault(); navigate('/skills'); },
    'mod+4':       (e) => { e.preventDefault(); navigate('/projects'); },
    'mod+5':       (e) => { e.preventDefault(); navigate('/blog'); },
    'mod+6':       (e) => { e.preventDefault(); navigate('/contact'); },
    'mod+7':       (e) => { e.preventDefault(); setActivePanel('games'); navigate('/games'); },
    'mod+,':       (e) => { e.preventDefault(); setSettingsOpen(true); },
  }, [navigate, settings.zenMode, update]);

  // ── CV route escapes the VS Code shell entirely ──
  if (location.pathname === '/cv') {
    return <CV />;
  }

  // ── Admin routes also escape the VS Code shell ──
  if (location.pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminSettingsProvider>
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            </AdminSettingsProvider>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="now" element={<AdminNow />} />
          <Route path="cv" element={<AdminCV />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    );
  }

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

      {!isLoading && (
        <div className="h-screen bg-gray-900 text-green-400 font-mono flex flex-col overflow-hidden">
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* VS Code Activity Bar (leftmost icon strip) */}
            <div className="zen-hide">
            <ActivityBar
              activePanel={activePanel}
              onSettingsClick={() => setSettingsOpen(true)}
              onPanelChange={(p) => {
                const panel = p as PanelId;
                if (panel === 'games') {
                  setActivePanel('games');
                  setSidebarCollapsed(false);
                  if (!location.pathname.startsWith('/games')) navigate('/games');
                  return;
                }
                // Navigating away from games while on a /games/* route → go home
                if (location.pathname.startsWith('/games')) {
                  navigate('/');
                }
                if (panel === activePanel && !sidebarCollapsed) {
                  setSidebarCollapsed(true);
                } else {
                  setActivePanel(panel);
                  setSidebarCollapsed(false);
                }
              }}
            />
            </div>

            {/* Backdrop on mobile when sidebar open */}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSidebarCollapsed(true)}
                  className="md:hidden fixed inset-0 bg-black/50 z-30"
                />
              )}
            </AnimatePresence>

            {/* Sidebar — animated width on desktop, fixed drawer on mobile */}
            <motion.div
              animate={{ width: sidebarCollapsed ? 0 : 256 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className={`overflow-hidden shrink-0 zen-hide ${
                sidebarCollapsed ? '' : 'max-md:fixed max-md:top-0 max-md:bottom-6 max-md:left-12 max-md:z-40 max-md:shadow-2xl'
              }`}
            >
              <Sidebar activeSection={activeSection} activePanel={activePanel} />
            </motion.div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* VS Code tab bar */}
              <div className="zen-hide">
                <TabBar
                  activeSection={activeSection}
                  onFileClick={() => setActivePanel('explorer')}
                />
              </div>

              {/* Breadcrumb */}
              <div className="zen-hide">
                <Breadcrumb
                  activeSection={activeSection}
                  onToggleSidebar={() => setSidebarCollapsed(c => !c)}
                />
              </div>

              {/* Editor content */}
              <div className="flex-1 overflow-y-auto p-6 zen-content">
                <div className="max-w-5xl">
                  <AnimatePresence mode="wait">
                    {activePanel === 'explorer' ? (
                      <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Routes location={location}>
                          <Route path="/" element={<About />} />
                          <Route path="/experience" element={<Experience />} />
                          <Route path="/skills" element={<Skills />} />
                          <Route path="/projects" element={<Projects />} />
                          <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogPost />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/games/*" element={<GamesPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </motion.div>
                    ) : activePanel === 'git' ? (
                      <motion.div key="git" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <SourceControlView />
                      </motion.div>
                    ) : activePanel === 'ext' ? (
                      <motion.div key="ext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <ExtensionsView />
                      </motion.div>
                    ) : activePanel === 'games' ? (
                      <motion.div key="games" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <GamesPage />
                      </motion.div>
                    ) : (
                      <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <TerminalView />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Problems panel (collapsible) */}
          {settings.showProblemsPanel && (
            <div className="zen-hide">
              <ProblemsPanel />
            </div>
          )}

          {/* VS Code status bar */}
          <div className="zen-hide">
            <StatusBar
              activeSection={activeSection}
              onPaletteOpen={() => { setPaletteMode('full'); setPaletteOpen(true); }}
            />
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        mode={paletteMode}
        commands={commands}
        onClose={() => setPaletteOpen(false)}
      />

      {/* Konami code — full-screen hacker mode */}
      <AnimatePresence>
        {konamiActive && <HackerMode onDone={() => setKonamiActive(false)} />}
      </AnimatePresence>

      {/* Settings modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onTriggerHack={() => setKonamiActive(true)}
      />
    </>
  );
}

export default App;
