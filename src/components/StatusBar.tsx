import { GitBranch, AlertCircle, CheckCircle, Bell } from 'lucide-react';
import type { SectionId } from './Sidebar';

const langMap: Record<SectionId, string> = {
  about: 'Markdown',
  experience: 'JSON',
  skills: 'JavaScript',
  projects: 'TypeScript React',
  blog: 'Markdown',
  contact: 'dotenv',
};

const lineMap: Record<SectionId, string> = {
  about: 'Ln 1, Col 1',
  experience: 'Ln 42, Col 1',
  skills: 'Ln 28, Col 1',
  projects: 'Ln 156, Col 1',
  blog: 'Ln 12, Col 1',
  contact: 'Ln 8, Col 1',
};

interface StatusBarProps {
  activeSection: SectionId;
}

export default function StatusBar({ activeSection }: StatusBarProps) {
  return (
    <div
      className="flex items-center justify-between px-3 shrink-0 select-none bg-blue-600 text-white h-[22px] text-xs font-mono"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertCircle size={11} />
          <span>0</span>
          <CheckCircle size={11} className="ml-1" />
          <span>0</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span>{lineMap[activeSection]}</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>{langMap[activeSection]}</span>
        <div className="flex items-center gap-1">
          <Bell size={12} />
        </div>
      </div>
    </div>
  );
}
