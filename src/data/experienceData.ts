export interface Experience {
  id: string;
  company: string;
  title: string;
  period: string;
  location: string;
  type: string;
  skills: string[];
  bullets: string[];
}

export const experiences: Experience[] = [
  {
    id: 'freelancer-2025',
    company: 'Full Stack Engineer (Consultant & Freelancer)',
    title: 'Senior Full Stack & AI Engineer',
    period: 'May 2025 – Present',
    location: 'Malmö, SE',
    type: 'Freelance',
    skills: ['React', 'Next.js', 'React Native', 'Expo', 'Firebase', 'Node.js', 'MySQL', 'AI Tools'],
    bullets: [
      'Architected and delivered full-stack web platforms, including custom booking systems, admin dashboards, and corporate websites.',
      'Engineered mobile applications using React Native and Expo, seamlessly integrated with scalable Firebase backends.',
      'Designed and implemented robust RESTful APIs and backend microservices utilizing Node.js and MySQL.',
      'Pioneered AI-assisted development workflows to significantly accelerate feature implementation and reduce time-to-market.',
      'Translated complex Figma designs into responsive, highly accessible, and user-friendly interfaces.',
      'Managed continuous deployment pipelines via Vercel and Firebase.',
    ],
  },
  {
    id: 'cognes',
    company: 'Cognes',
    title: 'Full Stack Developer',
    period: 'Jan 2025 – May 2025',
    location: 'Stockholm, SE',
    type: 'Full-time',
    skills: ['React Native', 'Expo', 'Firebase', 'Next.js', 'TypeScript', 'Figma', 'AI IDEs'],
    bullets: [
      'Spearheaded the development of a cross-platform mobile app for early dementia detection using React Native (Expo) and Firebase.',
      'Built a secure, responsive administrative dashboard using Next.js and Firebase Authentication.',
      'Leveraged advanced AI IDEs (Cursor, Windsurf) and ChatGPT to optimize code generation and expedite milestone deliveries.',
      'Crafted smooth, intuitive UI/UX layouts utilizing Figma, prioritizing accessibility for target demographics.',
    ],
  },
  {
    id: 'freelancer-2024',
    company: 'Web Developer (Consultant & Freelancer)',
    title: 'Full Stack Developer',
    period: 'May 2024 – Dec 2024',
    location: 'Malmö, SE',
    type: 'Freelance',
    skills: ['Next.js', 'React', 'React Native', 'Tailwind CSS', 'Cursor', 'Windsurf', 'SEO'],
    bullets: [
      'Delivered bespoke web and mobile solutions tailored to client needs using Next.js, React, and React Native.',
      'Maximized productivity and code quality by integrating AI tools like Cursor and Windsurf into the daily workflow.',
      'Developed and successfully launched "StramEnergi.dk", a modern clean energy platform heavily optimized for SEO and performance using Tailwind CSS.',
    ],
  },
  {
    id: 'skillur',
    company: 'Skillur AB',
    title: 'Full Stack Developer',
    period: 'Aug 2022 – May 2024',
    location: 'Helsingborg, SE',
    type: 'Full-time',
    skills: ['React.js', 'Node.js', 'TypeScript', 'MySQL', 'Express.js', 'Jira', 'Confluence'],
    bullets: [
      'Built and scaled a comprehensive job-matching and e-learning platform utilizing React.js, Node.js, TypeScript, and MySQL.',
      'Designed efficient database schemas to optimize data storage, retrieval, and overall application performance.',
      'Developed Express.js APIs for seamless frontend-backend data exchange via JSON.',
      'Collaborated in Agile environments using Jira and Confluence to manage workflows and resolve complex technical blockers.',
    ],
  },
  {
    id: 'talal',
    company: 'Talal Abu Ghazaleh',
    title: 'Frontend Developer',
    period: 'Dec 2017 – Apr 2019',
    location: 'Amman, Jordan',
    type: 'Full-time',
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Cross-browser Compatibility'],
    bullets: [
      'Developed fully responsive and cross-browser compatible user interfaces for client portals and internal enterprise platforms.',
      'Utilized HTML, CSS, and JavaScript to deliver high-quality front-end solutions for a leading IT consulting firm.',
    ],
  },
];
