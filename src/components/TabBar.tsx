import { useNavigate } from 'react-router-dom';
import { X, FileCode, Database, Code2, Monitor, Mail } from 'lucide-react';
import type { SectionId } from './Sidebar';

interface Tab {
  id: SectionId;
  path: string;
  name: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  color: string;
  extension: string;
}

const tabs: Tab[] = [
  { id: 'about',      path: '/',           name: 'README',     icon: FileCode, color: '#519aba', extension: '.md'   },
  { id: 'experience', path: '/experience', name: 'experience', icon: Database,  color: '#f1e05a', extension: '.json' },
  { id: 'skills',     path: '/skills',     name: 'skills',     icon: Code2,     color: '#f7df1e', extension: '.js'   },
  { id: 'projects',   path: '/projects',   name: 'projects',   icon: Monitor,   color: '#61dafb', extension: '.tsx'  },
  { id: 'contact',    path: '/contact',    name: 'contact',    icon: Mail,      color: '#e37933', extension: '.env'  },
];

interface TabBarProps {
  activeSection: SectionId;
}

export default function TabBar({ activeSection }: TabBarProps) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-end overflow-x-auto shrink-0"
      style={{ background: '#2d2d2d', borderBottom: '1px solid #3e3e42', height: 35, minHeight: 35 }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="flex items-center gap-1.5 px-4 h-full relative group transition-colors shrink-0"
            style={{
              background: isActive ? '#1e1e1e' : '#2d2d2d',
              color: isActive ? '#d4d4d4' : '#858585',
              border: 'none',
              borderRight: '1px solid #3e3e42',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'var(--mono)',
            }}
          >
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#007acc' }} />
            )}
            <Icon size={13} style={{ color: tab.color }} />
            <span>{tab.name}</span>
            <span style={{ color: '#5a5a5a', fontSize: 12 }}>{tab.extension}</span>
            <X
              size={12}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#858585' }}
            />
          </button>
        );
      })}
    </div>
  );
}
