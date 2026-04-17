import { motion } from 'framer-motion';
import { Monitor, ExternalLink } from 'lucide-react';
import type { Project } from '../data/projectsData';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white font-mono">{project.title}</h3>
        </div>

        {project.period && (
          <div className="text-green-300 text-xs font-mono mb-3">{project.period}</div>
        )}

        <p className="text-gray-300 mb-4 leading-relaxed text-sm">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-700 text-green-400 rounded text-sm font-mono">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <a
            href={project.gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors text-sm font-mono"
          >
            <ExternalLink size={16} /> View Code
          </a>
          {project.previewUrl && project.previewUrl !== project.gitUrl && (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors text-sm font-mono"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors text-sm font-mono cursor-pointer border-none"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
