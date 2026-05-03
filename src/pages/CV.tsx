import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, MapPin, Phone, Globe,
  ExternalLink as LinkedIn, Code2 as GitHub, FileDown, Sparkles, FileText,
} from 'lucide-react';
import { useCV } from '../hooks/useCV';
import { defaultCV } from '../data/defaultCV';

/* ═══════════════════════════════════════════════════════════════════
   CV / Resume — clean editorial layout
   Reads from Firestore (cv/main) with defaultCV fallback.
   Supports two view modes via ?view=modern|ats:
     - modern: branded, colorful screen-first design
     - ats:    plain single-column text, safe for Applicant Tracking
               System parsers used by recruiters and job boards.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Dedicated print + ATS stylesheet. React 19 auto-hoists <style> into <head>.
 *  - @page sets A4 margins so text never clips at the edges
 *  - `cv-avoid-break` keeps experience/project blocks on one page
 *  - `cv-article` strips shadows/padding when printed
 *  - print-color-adjust preserves accent colors on paper
 *  - `.cv-ats` subtree overrides: serif font, no icons/chips/colors,
 *    plain bullets — everything a resume parser expects.
 */
const PRINT_CSS = `
@page { size: A4; margin: 14mm 12mm; }
@media print {
  html, body { background: #ffffff !important; }
  body { font-size: 10.5pt; line-height: 1.45; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .cv-article {
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 12mm !important;
    max-width: 100% !important;
  }
  .cv-avoid-break { break-inside: avoid; page-break-inside: avoid; }
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
  a { color: inherit !important; text-decoration: none !important; }
  .cv-card { box-shadow: none !important; background: #fafafa !important; }
}

/* ── ATS mode (screen + print) ──────────────────────────────────── */
.cv-ats, .cv-ats * {
  font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif !important;
  color: #111 !important;
}
.cv-ats .cv-decor { display: none !important; }
.cv-ats .cv-contact-icon { display: none !important; }
.cv-ats .cv-chip,
.cv-ats .cv-tech-chip {
  background: transparent !important;
  border: 0 !important;
  padding: 0 !important;
  margin: 0 6pt 2pt 0 !important;
  border-radius: 0 !important;
  font-family: inherit !important;
  font-size: inherit !important;
}
.cv-ats .cv-chip + .cv-chip::before,
.cv-ats .cv-tech-chip + .cv-tech-chip::before { content: "• "; color: #666 !important; margin-right: 2pt; }
.cv-ats .cv-card {
  background: transparent !important;
  border: 0 !important;
  border-top: 1px solid #e5e5e5 !important;
  border-radius: 0 !important;
  padding: 6pt 0 !important;
  box-shadow: none !important;
}
.cv-ats .cv-exp-dot,
.cv-ats .cv-exp-bullet { background: #111 !important; border-color: #111 !important; box-shadow: none !important; }
.cv-ats .cv-rail { background: #ddd !important; }
.cv-ats h1 { font-size: 22pt !important; font-weight: 700 !important; letter-spacing: 0 !important; }
.cv-ats h2 { font-size: 11pt !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.5pt !important; }
.cv-ats h3 { font-size: 11pt !important; font-weight: 600 !important; }
.cv-ats .cv-title-tag { color: #111 !important; font-weight: 500 !important; }
`;

export default function CV() {
  const { data } = useCV();
  // Merge Firestore data on top of the built-in default so the page
  // always renders even if Firestore is down or unseeded.
  const cv = data ?? defaultCV;
  const year = new Date().getFullYear();

  // View mode is driven by the URL (?view=ats) so it is sharable/bookmarkable
  // and survives a hard refresh. Default is the branded "modern" layout.
  const [searchParams, setSearchParams] = useSearchParams();
  const ats = searchParams.get('view') === 'ats';

  const setView = useCallback(
    (next: 'modern' | 'ats') => {
      const params = new URLSearchParams(searchParams);
      if (next === 'ats') params.set('view', 'ats');
      else params.delete('view');
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // "Save as PDF" → hand off to the browser's native print dialog, which on
  // every modern browser offers a "Save as PDF" destination. We force ATS
  // mode first because recruiters' parsers prefer the plain layout. Two RAF
  // ticks let React commit the DOM change before the dialog opens.
  const saveAsPdf = useCallback(() => {
    if (!ats) setView('ats');
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  }, [ats, setView]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 font-sans antialiased ${ats ? 'cv-ats' : ''}`}>
      <style>{PRINT_CSS}</style>

      {/* Sticky top bar (hidden in print) */}
      <nav className="sticky top-0 z-20 backdrop-blur-md bg-white/80 border-b border-slate-200/70 print:hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div
              role="tablist"
              aria-label="CV view mode"
              className="inline-flex items-center bg-slate-100 rounded-md p-0.5 text-[12px] font-medium"
            >
              <button
                type="button"
                role="tab"
                aria-selected={ats ? 'false' : 'true'}
                onClick={() => setView('modern')}
                className={
                  !ats
                    ? 'inline-flex items-center gap-1 bg-white shadow-sm rounded-[5px] px-2.5 py-1 text-slate-900'
                    : 'inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-700 cursor-pointer'
                }
              >
                <Sparkles size={12} />
                Modern
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={ats ? 'true' : 'false'}
                onClick={() => setView('ats')}
                title="Plain single-column layout optimized for Applicant Tracking Systems"
                className={
                  ats
                    ? 'inline-flex items-center gap-1 bg-white shadow-sm rounded-[5px] px-2.5 py-1 text-slate-900'
                    : 'inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-700 cursor-pointer'
                }
              >
                <FileText size={12} />
                ATS
              </button>
            </div>

            <button
              onClick={saveAsPdf}
              type="button"
              title="Opens the browser print dialog — pick “Save as PDF” as destination"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-3.5 py-1.5 rounded-md transition-colors shadow-sm"
            >
              <FileDown size={14} />
              <span>Save as PDF</span>
            </button>
          </div>
        </div>

        {/* ATS-mode helper banner */}
        {ats && (
          <div className="bg-amber-50 border-t border-amber-200 text-amber-900 text-[12px] px-4 md:px-6 py-2 text-center">
            <strong>ATS mode:</strong> plain single-column layout for resume parsers. Use{' '}
            <button type="button" onClick={saveAsPdf} className="underline font-medium hover:text-amber-700 cursor-pointer bg-transparent border-0 p-0">
              Save as PDF
            </button>{' '}
            to export, then attach to your job application.
          </div>
        )}
      </nav>

      {/* Page */}
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="cv-article max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-14 bg-white shadow-sm md:rounded-xl md:my-6 relative overflow-hidden print:shadow-none print:rounded-none print:my-0"
      >
        {/* Decorative top accent band (hidden in print and ATS mode) */}
        <div
          className="cv-decor absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-500 via-cyan-400 to-transparent print:hidden"
          aria-hidden
        />

        {/* ── Hero ── */}
        <header className="pb-8 border-b border-slate-200 cv-avoid-break">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="cv-decor inline-flex items-center gap-2 mb-3 print:hidden">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700">
                  Open to opportunities
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.05]">
                {cv.hero.name}
              </h1>
              <p className="cv-title-tag mt-3 text-lg md:text-xl text-cyan-700 font-medium">
                {cv.hero.title}
              </p>
            </div>
          </div>

          {/* Contact row */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} className="cv-contact-icon text-slate-400" />
              {cv.hero.location}
            </span>
            <a href={`tel:${cv.hero.phone}`} className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Phone size={13} className="cv-contact-icon text-slate-400" />
              {cv.hero.phone}
            </a>
            <a href={`mailto:${cv.hero.email}`} className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Mail size={13} className="cv-contact-icon text-slate-400" />
              {cv.hero.email}
            </a>
            <a href={`https://${cv.hero.portfolio}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Globe size={13} className="cv-contact-icon text-slate-400" />
              {cv.hero.portfolio}
            </a>
            <a href={`https://${cv.hero.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <LinkedIn size={13} className="cv-contact-icon text-slate-400" />
              LinkedIn
            </a>
            <a href={`https://${cv.hero.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <GitHub size={13} className="cv-contact-icon text-slate-400" />
              GitHub
            </a>
          </div>
        </header>

        {/* ── Summary ── */}
        <Section index="01" title="Professional Summary">
          <p className="text-slate-700 leading-relaxed text-[14.5px] cv-avoid-break">
            {cv.summary}
          </p>
        </Section>

        {/* ── Skills ── */}
        <Section index="02" title="Technical Skills">
          <div className="space-y-3 cv-avoid-break">
            {cv.skills.map(group => (
              <div key={group.label} className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-1 md:gap-4 cv-avoid-break">
                <div className="text-[13px] font-semibold text-slate-900 md:pt-1 flex items-center gap-2">
                  <span className="cv-decor hidden md:inline w-1 h-4 rounded-full bg-cyan-500" aria-hidden />
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map(item => (
                    <span
                      key={item}
                      className="cv-chip inline-flex items-center bg-slate-50 text-slate-700 text-[12px] font-medium px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Experience (timeline) ── */}
        <Section index="03" title="Experience">
          <div className="relative">
            {/* vertical rail */}
            <div className="cv-rail absolute left-[7px] top-2 bottom-2 w-px bg-slate-200 print:bg-slate-300" aria-hidden />
            <div className="space-y-6">
              {cv.experience.map((job, i) => (
                <div key={i} className="relative pl-8 cv-avoid-break">
                  {/* dot */}
                  <span
                    className="cv-exp-dot absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-white border-2 border-cyan-600 shadow-[0_0_0_3px_white]"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-semibold text-slate-900 text-[15px]">
                      {job.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {job.period}
                    </span>
                  </div>
                  <div className="text-[13px] text-slate-600 mt-0.5">
                    <span className="font-medium text-slate-800">{job.company}</span>
                    <span className="text-slate-400"> · </span>
                    <span>{job.location}</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-[13.5px] text-slate-700 leading-relaxed">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="relative pl-4">
                        <span className="cv-exp-bullet absolute left-0 top-[9px] w-1 h-1 rounded-full bg-cyan-600" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Key Projects ── */}
        <Section index="04" title="Key Projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cv.projects.map(p => (
              <div
                key={p.title}
                className="cv-card cv-avoid-break bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-cyan-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 text-[14px]">{p.title}</h3>
                  <span className="text-[10.5px] font-mono text-slate-500 whitespace-nowrap tabular-nums">
                    {p.period}
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] text-slate-600 leading-relaxed">
                  {p.blurb}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {p.tech.map(t => (
                    <span
                      key={t}
                      className="cv-tech-chip text-[10px] font-mono text-cyan-700 bg-cyan-50 border border-cyan-100 px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Education ── */}
        <Section index="05" title="Education">
          <div className="space-y-2.5 cv-avoid-break">
            {cv.education.map((e, i) => (
              <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 cv-avoid-break">
                <div>
                  <div className="font-semibold text-slate-900 text-[13.5px]">{e.degree}</div>
                  <div className="text-[13px] text-slate-600">{e.school}</div>
                </div>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">{e.period}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Languages & Interests ── */}
        <Section index="06" title="Languages & Interests">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cv-avoid-break">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Languages
              </div>
              <div className="space-y-1.5">
                {cv.languages.map(l => (
                  <div key={l.name} className="flex items-baseline justify-between text-[13px]">
                    <span className="font-medium text-slate-800">{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Interests
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cv.interests.map(i => (
                  <span
                    key={i}
                    className="cv-chip inline-flex items-center bg-slate-50 text-slate-700 text-[12px] font-medium px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Print-only footer line with contact info (shows on every printed page) */}
        <div className="hidden print:block mt-10 pt-4 border-t border-slate-200 text-[10px] text-slate-500 text-center font-mono">
          {cv.hero.name} · {cv.hero.email} · {cv.hero.portfolio} · {year}
        </div>
      </motion.article>

      <footer className="max-w-4xl mx-auto px-6 pb-10 pt-2 text-center text-xs text-slate-500 print:hidden">
        © {year} {cv.hero.name} ·{' '}
        <Link to="/" className="hover:text-slate-800 underline">interactive portfolio</Link>
      </footer>
    </div>
  );
}

/* ─── primitives ─── */

function Section({
  title,
  index,
  children,
}: {
  title: string;
  index?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-8">
      <h2 className="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-900 mb-4">
        {index && (
          <span className="cv-decor font-mono text-[10px] text-cyan-600 tabular-nums" aria-hidden>
            {index}
          </span>
        )}
        <span className="flex items-center gap-2 flex-1">
          <span>{title}</span>
          <span className="cv-decor flex-1 h-px bg-slate-200 print:bg-slate-300" aria-hidden />
        </span>
      </h2>
      {children}
    </section>
  );
}
