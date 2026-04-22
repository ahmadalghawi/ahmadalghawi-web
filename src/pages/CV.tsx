import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Mail, MapPin, Phone, Globe,
  ExternalLink as LinkedIn, Code2 as GitHub, Printer,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   CV / Resume — clean editorial layout
   Lives outside the VS Code shell (App.tsx returns this for `/cv`)
   ═══════════════════════════════════════════════════════════════════ */

/* ─── data ─── */

const HERO = {
  name: 'Ahmad Alghawi',
  title: 'Senior Full Stack & AI Engineer',
  location: 'Malmö, SE 21372',
  phone: '+46 73-742 14 90',
  email: 'Ahmadalghawi.86@gmail.com',
  portfolio: 'ahmadalghawi.com',
  linkedin: 'linkedin.com/in/ahmad-alghawi-310722197',
  github: 'github.com/ahmadalghawi',
};

const SUMMARY = `AI-driven Senior Full Stack Engineer with 4+ years of experience building high-performance, scalable web and mobile applications. Specialized in a modern stack including React, Next.js, React Native (Expo), Node.js, TypeScript, and Firebase. Skilled in leveraging AI-assisted workflows (Cursor, Windsurf, Claude) to accelerate delivery and ensure clean, maintainable architecture. Proven track record owning end-to-end product lifecycles — from Figma designs to production deployment.`;

const SKILLS: Array<{ label: string; items: string[] }> = [
  { label: 'Frontend & Web',    items: ['React.js', 'Next.js (App Router)', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS'] },
  { label: 'Mobile',            items: ['React Native', 'Expo'] },
  { label: 'Backend & Database',items: ['Node.js', 'Express.js', 'MySQL', 'Firebase (Auth · Firestore · Functions)', 'JWT', 'Stripe'] },
  { label: 'AI Development',    items: ['Cursor', 'Windsurf', 'Claude CLI', 'Antigravity', 'ChatGPT'] },
  { label: 'Design & Workflow', items: ['Figma', 'Git / GitHub', 'Jira', 'Confluence', 'Vercel'] },
];

interface Role {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

const EXPERIENCE: Role[] = [
  {
    role: 'Full Stack Engineer — Consultant & Freelancer',
    company: 'Independent',
    location: 'Malmö, SE',
    period: 'May 2025 – Present',
    bullets: [
      'Architected and delivered full-stack web platforms including custom booking systems, admin dashboards, and corporate websites.',
      'Engineered mobile applications using React Native and Expo, integrated with scalable Firebase backends.',
      'Designed and implemented robust RESTful APIs and backend microservices using Node.js and MySQL.',
      'Pioneered AI-assisted development workflows to accelerate feature implementation and reduce time-to-market.',
      'Translated complex Figma designs into responsive, highly accessible, user-friendly interfaces.',
      'Managed continuous deployment pipelines via Vercel and Firebase.',
    ],
  },
  {
    role: 'Full Stack Developer',
    company: 'Cognes',
    location: 'Stockholm, SE',
    period: 'Jan 2025 – May 2025',
    bullets: [
      'Spearheaded the development of a cross-platform mobile app for early dementia detection using React Native (Expo) and Firebase.',
      'Built a secure, responsive administrative dashboard using Next.js and Firebase Authentication.',
      'Leveraged AI IDEs (Cursor, Windsurf) and ChatGPT to optimize code generation and expedite milestone deliveries.',
      'Crafted smooth, intuitive UI/UX layouts in Figma, prioritizing accessibility for target demographics.',
    ],
  },
  {
    role: 'Web Developer — Consultant & Freelancer',
    company: 'Independent',
    location: 'Malmö, SE',
    period: 'May 2024 – Dec 2024',
    bullets: [
      'Delivered bespoke web and mobile solutions tailored to client needs using Next.js, React, and React Native.',
      'Maximized productivity and code quality by integrating AI tools (Cursor, Windsurf) into the daily workflow.',
      'Developed and launched StramEnergi.dk — a modern clean-energy platform heavily optimized for SEO and performance.',
    ],
  },
  {
    role: 'Full Stack Developer',
    company: 'Skillur AB',
    location: 'Helsingborg, SE',
    period: 'Aug 2022 – May 2024',
    bullets: [
      'Built and scaled a comprehensive job-matching and e-learning platform using React.js, Node.js, TypeScript, and MySQL.',
      'Designed efficient database schemas to optimize data storage, retrieval, and overall application performance.',
      'Developed Express.js APIs for seamless frontend-backend data exchange via JSON.',
      'Collaborated in Agile environments using Jira and Confluence to manage workflows and resolve technical blockers.',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Talal Abu-Ghazaleh',
    location: 'Amman, Jordan',
    period: 'Dec 2017 – Apr 2019',
    bullets: [
      'Developed fully responsive, cross-browser compatible UIs for client portals and internal enterprise platforms.',
      'Delivered high-quality frontend solutions with HTML, CSS, and JavaScript at a leading IT consulting firm.',
    ],
  },
  {
    role: 'Store Employee & Technical Supporter',
    company: "Ala'a Elddeen Store / GameOver",
    location: 'Amman, Jordan',
    period: 'Mar 2012 – Dec 2017',
    bullets: [
      'Provided technical support for gaming consoles and managed hardware, network operations, and software installations.',
    ],
  },
];

interface Project {
  name: string;
  period: string;
  blurb: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    name: 'Nashama Delivery',
    period: 'May 2025 – Present',
    blurb: 'React Native cross-platform app connecting shops and drivers. Real-time order claiming, voice notes, WhatsApp integration, and full Arabic support on a Firebase backend.',
    tags: ['React Native', 'Expo', 'Firebase', 'i18n'],
  },
  {
    name: 'Just Driving',
    period: 'May 2025 – Present',
    blurb: 'Contributed UI/UX improvements, API integration, and bug fixing for a React Native mobile app mirroring web platform functionality.',
    tags: ['React Native', 'API'],
  },
  {
    name: 'Cognes Dementia App',
    period: 'Jan 2025 – Present',
    blurb: 'Mobile application with Expo and Firebase featuring video recording and appointment booking, paired with a Next.js admin dashboard.',
    tags: ['Expo', 'Firebase', 'Next.js'],
  },
  {
    name: 'StramEnergi.dk',
    period: 'Jun 2024 – Jan 2025',
    blurb: 'Clean-energy responsive web platform built with Next.js, TypeScript, and Tailwind CSS — prioritizing SEO and clean UX.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'SEO'],
  },
  {
    name: 'Skillur.com',
    period: 'Aug 2022 – May 2024',
    blurb: 'Core contributor to APIs and dashboard features for an e-learning platform using React, Node.js, and MySQL.',
    tags: ['React', 'Node.js', 'MySQL'],
  },
];

const EDUCATION = [
  { degree: 'Diploma, .NET Full Stack',                    school: 'Lexicon',                          period: 'Dec 2020 – May 2021' },
  { degree: "Bachelor's in Computer Information Systems",  school: "Al-Balqa' Applied University",     period: 'Sep 2006 – Aug 2009' },
  { degree: 'Tawjehe — IT',                                school: 'Al-Shareef Hussein Ben Naser',     period: 'Feb 2002 – Jul 2004' },
];

const LANGUAGES = [
  { name: 'Arabic',  level: 'Native' },
  { name: 'English', level: 'Fluent' },
  { name: 'Swedish', level: 'Basic'  },
];

const INTERESTS = ['Photography', 'Cooking', 'Football'];

/* ─── page ─── */

export default function CV() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Sticky top bar (hidden in print) */}
      <nav className="sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-slate-200 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium px-3 py-1.5 rounded-md"
              type="button"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
            <a
              href="/Ahmad-Alghawi-CV.pdf"
              download
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-3.5 py-1.5 rounded-md transition-colors"
            >
              <Download size={14} />
              <span>PDF</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Page */}
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14 bg-white shadow-sm md:rounded-xl md:my-6 print:shadow-none print:rounded-none print:my-0"
      >
        {/* ── Hero ── */}
        <header className="pb-8 border-b border-slate-200">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                {HERO.name}
              </h1>
              <p className="mt-2 text-lg md:text-xl text-cyan-700 font-medium">
                {HERO.title}
              </p>
            </div>
          </div>

          {/* Contact row */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" />
              {HERO.location}
            </span>
            <a href={`tel:${HERO.phone}`} className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Phone size={14} className="text-slate-400" />
              {HERO.phone}
            </a>
            <a href={`mailto:${HERO.email}`} className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Mail size={14} className="text-slate-400" />
              {HERO.email}
            </a>
            <a href={`https://${HERO.portfolio}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Globe size={14} className="text-slate-400" />
              {HERO.portfolio}
            </a>
            <a href={`https://${HERO.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <LinkedIn size={14} className="text-slate-400" />
              LinkedIn
            </a>
            <a href={`https://${HERO.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <GitHub size={14} className="text-slate-400" />
              GitHub
            </a>
          </div>
        </header>

        {/* ── Summary ── */}
        <Section title="Professional Summary">
          <p className="text-slate-700 leading-relaxed text-[15px]">
            {SUMMARY}
          </p>
        </Section>

        {/* ── Skills ── */}
        <Section title="Technical Skills">
          <div className="space-y-3">
            {SKILLS.map(group => (
              <div key={group.label} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4">
                <div className="text-sm font-semibold text-slate-900 md:pt-1">
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map(item => (
                    <span
                      key={item}
                      className="inline-flex items-center bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200"
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
        <Section title="Experience">
          <div className="relative">
            {/* vertical rail */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200 print:bg-slate-300" aria-hidden />
            <div className="space-y-7">
              {EXPERIENCE.map((job, i) => (
                <div key={i} className="relative pl-8">
                  {/* dot */}
                  <span
                    className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-white border-2 border-cyan-600"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-semibold text-slate-900 text-base">
                      {job.role}
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      {job.period}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5">
                    <span className="font-medium">{job.company}</span>
                    <span className="text-slate-400"> · </span>
                    <span>{job.location}</span>
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-[14px] text-slate-700 leading-relaxed">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="relative pl-4">
                        <span className="absolute left-0 top-[9px] w-1 h-1 rounded-full bg-slate-400" aria-hidden />
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
        <Section title="Key Projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROJECTS.map(p => (
              <div
                key={p.name}
                className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-cyan-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">{p.name}</h3>
                  <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                    {p.period}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] text-slate-600 leading-relaxed">
                  {p.blurb}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {p.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] font-mono text-cyan-700 bg-cyan-50 border border-cyan-100 px-1.5 py-0.5 rounded"
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
        <Section title="Education">
          <div className="space-y-3">
            {EDUCATION.map((e, i) => (
              <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{e.degree}</div>
                  <div className="text-sm text-slate-600">{e.school}</div>
                </div>
                <span className="text-xs font-mono text-slate-500">{e.period}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Languages & Interests ── */}
        <Section title="Languages & Interests">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Languages
              </div>
              <div className="space-y-1.5">
                {LANGUAGES.map(l => (
                  <div key={l.name} className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-slate-800">{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Interests
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS.map(i => (
                  <span
                    key={i}
                    className="inline-flex items-center bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </motion.article>

      <footer className="max-w-4xl mx-auto px-6 pb-10 pt-2 text-center text-xs text-slate-500 print:hidden">
        © {new Date().getFullYear()} {HERO.name} ·
        {' '}
        <Link to="/" className="hover:text-slate-800 underline">interactive portfolio</Link>
      </footer>
    </div>
  );
}

/* ─── primitives ─── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-8">
      <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-slate-900 mb-4">
        <span className="w-6 h-px bg-cyan-600" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}
