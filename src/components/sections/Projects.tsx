import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Folder, FileCode, ExternalLink, ArrowRight } from 'lucide-react';
import staticProjects from '../../data/projectsData';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../lib/types';

const filters = ['All', 'Web', 'Mobile', 'Both'] as const;

// The static `projectsData` predates the Firestore schema (`order` is new).
// Adapt it to `Project` so the component can be type-uniform across sources.
const fallbackProjects: Project[] = staticProjects.map((p, idx) => ({ ...p, order: idx }));

export default function Projects() {
  const [filter, setFilter] = useState<string>('All');
  const navigate = useNavigate();

  const { data } = useProjects();
  // Firestore first, static fallback until seeded / while offline
  const source: Project[] = data && data.length > 0 ? data : fallbackProjects;
  const visible = filter === 'All' ? source : source.filter((p) => p.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="text-blue-400" size={24} />
          <span className="text-white text-xl font-bold">projects.tsx</span>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors cursor-pointer border-none ${
                filter === f
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-700 text-green-400 hover:bg-gray-600'
              }`}
            >
              {f === 'All' ? 'show_all()' : f === 'Both' ? 'filter_both()' : `filter_${f.toLowerCase()}()`}
            </button>
          ))}
          <span className="text-gray-400 text-sm self-center">{visible.length} results</span>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-900 border border-gray-600 rounded-lg overflow-hidden hover:border-green-400 transition-colors cursor-pointer group"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Image */}
                <div className="h-32 bg-gray-800 relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const next = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (next) next.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-800 items-center justify-center">
                    <FileCode className="text-green-400" size={32} />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-600 text-white">{project.type}</span>
                    <div className="flex flex-wrap justify-center gap-1">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono px-1.5 py-0.5 rounded bg-gray-700 text-green-400">{tag}</span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs mt-1 flex items-center gap-1">View case study <ArrowRight size={10} /></span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="text-yellow-400" size={16} />
                    <span className="text-cyan-400 font-mono text-sm font-semibold">{project.title}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-700 text-green-400 rounded text-xs font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={project.gitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <ExternalLink size={14} /> Code
                    </a>
                    {project.previewUrl && (
                      <a
                        href={project.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
  );
}
