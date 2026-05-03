/**
 * Default CV content — single source of truth for:
 *   - the public /cv page (fallback)
 *   - the Firestore seed script (cv/main)
 *   - the admin editor (/admin/cv)
 */
import type { CVDoc } from '../lib/types';

export const defaultCV: CVDoc = {
  hero: {
    name: 'Ahmad Alghawi',
    title: 'Senior Full Stack & AI Engineer',
    location: 'Malmö, SE 21372',
    phone: '+46 73-742 14 90',
    email: 'Ahmadalghawi.86@gmail.com',
    portfolio: 'ahmadalghawi.com',
    linkedin: 'linkedin.com/in/ahmad-alghawi-310722197',
    github: 'github.com/ahmadalghawi',
  },
  summary:
    'AI-driven Senior Full Stack Engineer with 4+ years of experience building high-performance, scalable web and mobile applications. Specialized in a modern stack including React, Next.js, React Native (Expo), Node.js, TypeScript, and Firebase. Skilled in leveraging AI-assisted workflows (Cursor, Windsurf, Claude) to accelerate delivery and ensure clean, maintainable architecture. Proven track record owning end-to-end product lifecycles — from Figma designs to production deployment.',
  skills: [
    {
      label: 'Frontend & Web',
      items: [
        'React.js',
        'Next.js (App Router)',
        'TypeScript',
        'Tailwind CSS',
        'JavaScript',
        'HTML',
        'CSS',
      ],
    },
    {
      label: 'Mobile',
      items: ['React Native', 'Expo'],
    },
    {
      label: 'Backend & Database',
      items: [
        'Node.js',
        'Express.js',
        'MySQL',
        'Firebase (Auth · Firestore · Functions)',
        'JWT',
        'Stripe',
      ],
    },
    {
      label: 'AI Development',
      items: ['Cursor', 'Windsurf', 'Claude CLI', 'Antigravity', 'ChatGPT'],
    },
    {
      label: 'Design & Workflow',
      items: ['Figma', 'Git / GitHub', 'Jira', 'Confluence', 'Vercel'],
    },
  ],
  experience: [
    {
      title: 'Full Stack Engineer — Consultant & Freelancer',
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
      title: 'Full Stack Developer',
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
      title: 'Web Developer — Consultant & Freelancer',
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
      title: 'Full Stack Developer',
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
      title: 'Frontend Developer',
      company: 'Talal Abu-Ghazaleh',
      location: 'Amman, Jordan',
      period: 'Dec 2017 – Apr 2019',
      bullets: [
        'Developed fully responsive, cross-browser compatible UIs for client portals and internal enterprise platforms.',
        'Delivered high-quality frontend solutions with HTML, CSS, and JavaScript at a leading IT consulting firm.',
      ],
    },
    {
      title: 'Store Employee & Technical Supporter',
      company: "Ala'a Elddeen Store / GameOver",
      location: 'Amman, Jordan',
      period: 'Mar 2012 – Dec 2017',
      bullets: [
        'Provided technical support for gaming consoles and managed hardware, network operations, and software installations.',
      ],
    },
  ],
  projects: [
    {
      title: 'Nashama Delivery',
      period: 'May 2025 – Present',
      blurb:
        'React Native cross-platform app connecting shops and drivers. Real-time order claiming, voice notes, WhatsApp integration, and full Arabic support on a Firebase backend.',
      tech: ['React Native', 'Expo', 'Firebase', 'i18n'],
    },
    {
      title: 'Just Driving',
      period: 'May 2025 – Present',
      blurb:
        'Contributed UI/UX improvements, API integration, and bug fixing for a React Native mobile app mirroring web platform functionality.',
      tech: ['React Native', 'API'],
    },
    {
      title: 'Cognes Dementia App',
      period: 'Jan 2025 – Present',
      blurb:
        'Mobile application with Expo and Firebase featuring video recording and appointment booking, paired with a Next.js admin dashboard.',
      tech: ['Expo', 'Firebase', 'Next.js'],
    },
    {
      title: 'StramEnergi.dk',
      period: 'Jun 2024 – Jan 2025',
      blurb:
        'Clean-energy responsive web platform built with Next.js, TypeScript, and Tailwind CSS — prioritizing SEO and clean UX.',
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'SEO'],
    },
    {
      title: 'Skillur.com',
      period: 'Aug 2022 – May 2024',
      blurb:
        'Core contributor to APIs and dashboard features for an e-learning platform using React, Node.js, and MySQL.',
      tech: ['React', 'Node.js', 'MySQL'],
    },
  ],
  education: [
    {
      degree: 'Diploma, .NET Full Stack',
      school: 'Lexicon',
      period: 'Dec 2020 – May 2021',
    },
    {
      degree: "Bachelor's in Computer Information Systems",
      school: "Al-Balqa' Applied University",
      period: 'Sep 2006 – Aug 2009',
    },
    {
      degree: 'Tawjehe — IT',
      school: 'Al-Shareef Hussein Ben Naser',
      period: 'Feb 2002 – Jul 2004',
    },
  ],
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Fluent' },
    { name: 'Swedish', level: 'Basic' },
  ],
  interests: ['Photography', 'Cooking', 'Football'],
};
