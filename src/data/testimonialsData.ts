export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ahmad consistently delivers clean, production-ready code. His ability to move between frontend, backend and mobile makes him a force multiplier on any team.",
    author: "Team Lead",
    role: "Engineering Manager",
    company: "Skillur AB",
  },
  {
    quote:
      "One of the few developers I've worked with who embraces AI-assisted workflows without losing rigor. Ships fast and thinks in systems.",
    author: "Product Lead",
    role: "Head of Product",
    company: "Cognes",
  },
  {
    quote:
      "Pragmatic, fast, and dependable. Ahmad takes ownership end-to-end — from API design to pixel-perfect UI.",
    author: "Senior Developer",
    role: "Full Stack Engineer",
    company: "Freelance client",
  },
];
