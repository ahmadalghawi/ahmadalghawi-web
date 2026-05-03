/**
 * ProjectCaseStudy — deep-dive project page inside the VS Code shell.
 *
 * Mirrors BlogPost structure: hero image, description, optional markdown caseStudy,
 * gallery grid, problem/outcome/architecture pills, and JSON-LD CreativeWork schema.
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Folder, Calendar, Layers, Target, CheckCircle2 } from 'lucide-react';
import { getProjectById } from '../../lib/repositories/projects';
import type { Project } from '../../lib/types';
import MarkdownRender from '../blog/MarkdownRender';
import { LoadingState } from '../admin/ui';

export default function ProjectCaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProject(undefined);
    getProjectById(slug)
      .then(setProject)
      .catch(() => setProject(null));
  }, [slug]);

  if (project === undefined) {
    return (
      <section className="max-w-5xl mx-auto py-10 px-4">
        <LoadingState />
      </section>
    );
  }

  if (project === null) {
    return (
      <section className="max-w-5xl mx-auto py-10 px-4 text-center">
        <title>Not found — Ahmad Alghawi</title>
        <meta name="robots" content="noindex" />
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Project not found</h1>
        <p className="text-zinc-400 mb-6">The project you are looking for does not exist.</p>
        <Link to="/projects" className="text-cyan-400 hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Back to projects
        </Link>
      </section>
    );
  }

  const canonical = `${window.location.origin}/projects/${project.id}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: canonical,
    codeRepository: project.gitUrl,
    programmingLanguage: project.tags,
    image: project.image,
    author: {
      '@type': 'Person',
      name: 'Ahmad Alghawi',
    },
    datePublished: project.period?.split('–')[0]?.trim(),
    applicationCategory: project.type === 'Mobile' ? 'MobileApplication' : 'WebApplication',
  };

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <title>{`${project.title} — Ahmad Alghawi`}</title>
      <meta name="description" content={project.description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={project.title} />
      <meta property="og:description" content={project.description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={project.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <Link to="/projects" className="text-sm text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {/* Hero */}
      <div className="aspect-video rounded-xl overflow-hidden border border-zinc-800 mb-8">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="text-yellow-400" size={20} />
          <h1 className="text-3xl font-bold text-zinc-100">{project.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-4">
          {project.period && (
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {project.period}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Layers size={14} /> {project.type}
          </span>
        </div>
        <p className="text-zinc-300 text-base leading-relaxed">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-green-400 rounded text-xs font-mono">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 mt-6">
          <a
            href={project.gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={14} /> View code
          </a>
          {project.previewUrl && (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              <ExternalLink size={14} /> Live demo
            </a>
          )}
        </div>
      </header>

      {/* Context pills — problem / architecture / outcome */}
      {(project.problem || project.architecture || project.outcome) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {project.problem && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wide mb-2">
                <Target size={12} /> Problem
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{project.problem}</p>
            </div>
          )}
          {project.architecture && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wide mb-2">
                <Layers size={12} /> Stack
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{project.architecture}</p>
            </div>
          )}
          {project.outcome && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wide mb-2">
                <CheckCircle2 size={12} /> Outcome
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{project.outcome}</p>
            </div>
          )}
        </div>
      )}

      {/* Case-study body (markdown) */}
      {project.caseStudy && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-cyan-500 rounded-full" />
            Case Study
          </h2>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5">
            <MarkdownRender>{project.caseStudy}</MarkdownRender>
          </div>
        </div>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-purple-500 rounded-full" />
            Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((url, i) => (
              <div key={i} className="aspect-video rounded-lg overflow-hidden border border-zinc-800">
                <img src={url} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback when no deep-dive content exists yet */}
      {!project.caseStudy && !project.problem && !project.outcome && !project.architecture && !(project.gallery && project.gallery.length > 0) && (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 text-center text-zinc-500 text-sm">
          <p>Detailed case study coming soon.</p>
          <p className="mt-1 text-zinc-600 text-xs">Check back for architecture notes, design decisions, and lessons learned.</p>
        </div>
      )}
    </section>
  );
}
