import { Files, GitBranch, Settings, User, Blocks, Terminal } from 'lucide-react';

interface ActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  onSettingsClick?: () => void;
}

const topItems = [
  { id: 'explorer', icon: Files,     label: 'Explorer'       },
  { id: 'git',      icon: GitBranch, label: 'Source Control' },
  { id: 'ext',      icon: Blocks,    label: 'Extensions'     },
  { id: 'terminal', icon: Terminal,  label: 'Terminal'       },
];

const bottomItems = [
  { id: 'profile',  icon: User,     label: 'Profile'  },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function ActivityBar({ activePanel, onPanelChange, onSettingsClick }: ActivityBarProps) {
  return (
    <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2 shrink-0">
      {/* Top icons */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {topItems.map(({ id, icon: Icon, label }) => {
          const isActive = activePanel === id;
          return (
            <button
              key={id}
              title={label}
              onClick={() => onPanelChange(id)}
              className={`relative w-12 h-12 flex items-center justify-center group cursor-pointer border-none bg-transparent transition-colors ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-white rounded-r" />
              )}
              <Icon size={22} strokeWidth={isActive ? 1.8 : 1.4} />
              {/* Tooltip */}
              <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            title={label}
            onClick={() => { if (id === 'settings') onSettingsClick?.(); }}
            className="relative w-12 h-12 flex items-center justify-center group cursor-pointer border-none bg-transparent text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Icon size={20} strokeWidth={1.4} />
            <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
