export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: 'Web' | 'Mobile' | 'Both';
  image: string;
  gitUrl: string;
  previewUrl?: string;
  period?: string;
}

const projectsData: Project[] = [
  {
    id: 'nashama',
    title: 'Nashama Delivery',
    description: 'React Native cross-platform app connecting shops and drivers. Features real-time order claiming, voice notes, WhatsApp integration, and full Arabic support on a Firebase backend.',
    tags: ['React Native', 'Expo', 'Firebase', 'Arabic', 'Mobile'],
    type: 'Mobile',
    image: '/images/projects/IphoneX.png',
    gitUrl: 'https://github.com/ahmadalghawi',
    period: 'May 2025 – Present',
  },
  {
    id: 'cognes-app',
    title: 'Cognes Dementia App',
    description: 'Mobile application built with Expo and Firebase featuring video recording and appointment booking, paired with a Next.js admin dashboard.',
    tags: ['React Native', 'Expo', 'Firebase', 'Next.js', 'Mobile'],
    type: 'Both',
    image: '/images/projects/cognes.png',
    gitUrl: 'https://github.com/ahmadalghawi',
    period: 'Jan 2025 – Present',
  },
  {
    id: 'stramenergi',
    title: 'StramEnergi.dk',
    description: 'Clean energy responsive web platform built with Next.js, TypeScript, and Tailwind CSS, prioritizing SEO and clean UX.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SEO', 'Web'],
    type: 'Web',
    image: '/images/projects/stramenergi.png',
    gitUrl: 'https://github.com/ahmadalghawi',
    previewUrl: 'https://stramenergi.dk',
    period: 'Jun 2024 – Jan 2025',
  },
  {
    id: 'skillur',
    title: 'Skillur.com',
    description: 'Core contributor to APIs and dashboard features for an e-learning and job-matching platform using React, Node.js, and MySQL.',
    tags: ['React.js', 'Node.js', 'MySQL', 'Express.js', 'Web'],
    type: 'Web',
    image: '/images/projects/skillur.png',
    gitUrl: 'https://github.com/ahmadalghawi',
    previewUrl: 'https://www.skillur.com/',
    period: 'Aug 2022 – May 2024',
  },
  {
    id: 'syrexperts',
    title: 'SyrExperts',
    description: 'Full-stack platform connecting Syrian professionals and freelancers with clients worldwide.',
    tags: ['React', 'Node.js', 'Firebase', 'Web'],
    type: 'Web',
    image: '/images/projects/syrexperts.png',
    gitUrl: 'https://github.com/ahmadalghawi',
  },
  {
    id: 'cleenzi',
    title: 'Cleenzi',
    description: 'Cleaning service booking platform with real-time scheduling, admin dashboard, and Stripe payment integration.',
    tags: ['Next.js', 'Stripe', 'Firebase', 'Tailwind CSS', 'Web'],
    type: 'Web',
    image: '/images/projects/cleenzi.png',
    gitUrl: 'https://github.com/ahmadalghawi',
  },
  {
    id: 'pokemon',
    title: 'Pokemon Explorer',
    description: 'React + TypeScript app that lets users explore the full Pokédex via the PokéAPI with search and filtering.',
    tags: ['React', 'TypeScript', 'API', 'Web'],
    type: 'Web',
    image: '/images/projects/pokemon-Explorer.png',
    gitUrl: 'https://github.com/ahmadalghawi/Pokemon',
    previewUrl: 'https://ahmadalghawi.github.io/Pokemon/',
  },
  {
    id: 'shawarmax',
    title: 'ShawarmaX',
    description: 'ASP.NET Core CRUD application for managing a shawarma restaurant menu and orders.',
    tags: ['ASP.NET Core', 'C#', 'CRUD', 'Web'],
    type: 'Web',
    image: '/images/projects/shawrmax.png',
    gitUrl: 'https://github.com/ahmadalghawi/ShawarmaX',
  },
  {
    id: 'github-fetch',
    title: 'GitHub Fetch',
    description: 'Tool to search and display GitHub user profiles and repositories via the GitHub API.',
    tags: ['React', 'GitHub API', 'Web'],
    type: 'Web',
    image: '/images/projects/GitHub_Fetch.jpg',
    gitUrl: 'https://github.com/ahmadalghawi',
  },
  {
    id: 'food-recipe',
    title: 'Food Recipe App',
    description: 'Recipe discovery app with search, filters by cuisine, and ingredient-based lookup using a public food API.',
    tags: ['React', 'API', 'Web'],
    type: 'Web',
    image: '/images/projects/food-recipt.png',
    gitUrl: 'https://github.com/ahmadalghawi',
  },
  {
    id: 'myportfolio',
    title: 'Portfolio v1',
    description: 'First-generation personal portfolio built with React and Bootstrap, featuring responsive layout and project showcase.',
    tags: ['React', 'Bootstrap', 'Web'],
    type: 'Web',
    image: '/images/projects/myportfolio.png',
    gitUrl: 'https://github.com/ahmadalghawi/myportfolio',
    previewUrl: 'https://ahmadalghawi.github.io/myportfolio/',
  },
  {
    id: 'gameover',
    title: 'GameOver Web',
    description: 'Web platform for a gaming store featuring product listings, categories, and an e-commerce interface.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web'],
    type: 'Web',
    image: '/images/projects/gameover-web.jpg',
    gitUrl: 'https://github.com/ahmadalghawi',
  },
  {
    id: 'template-one',
    title: 'Portfolio Template One',
    description: 'Clean, modern portfolio template designed for developers with smooth scroll and dark theme.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web'],
    type: 'Web',
    image: '/images/projects/portfolio-Template-one.jpg',
    gitUrl: 'https://github.com/ahmadalghawi',
  },
  {
    id: 'template-two',
    title: 'Portfolio Template Two',
    description: 'Alternative developer portfolio template with animated sections and mobile-first design.',
    tags: ['React', 'CSS', 'Web'],
    type: 'Web',
    image: '/images/projects/template2.png',
    gitUrl: 'https://github.com/ahmadalghawi',
  },
];

export default projectsData;
