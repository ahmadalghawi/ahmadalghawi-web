/**
 * Shared domain types for Firestore-backed content.
 *
 * These mirror the existing `src/data/*.ts` shapes but add:
 *   - `order: number`        — explicit sort key (doc ids are random)
 *   - `createdAt` / `updatedAt` — Firestore Timestamps
 *
 * On read, Firestore Timestamps are serialized to ISO strings so the public
 * site can use them without depending on the SDK.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: 'Web' | 'Mobile' | 'Both';
  image: string;
  imagePath?: string;          // Firebase Storage object path — for delete
  gitUrl: string;
  previewUrl?: string;
  period?: string;
  order: number;
  createdAt?: string;          // ISO timestamp after read
  updatedAt?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  period: string;
  location: string;
  type: string;
  skills: string[];
  bullets: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NowItem {
  id: string;
  label: string;
  value: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  body: string;
  read: boolean;
  createdAt: string;
  userAgent?: string;
}

/* ─── CV page content ────────────────────────────────────────────────── */

export interface CVHero {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  portfolio: string;
  linkedin: string;
  github: string;
}

export interface CVSkillGroup {
  label: string;
  items: string[];
}

export interface CVRole {
  title: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface CVProject {
  title: string;
  period: string;
  blurb: string;
  tech: string[];
}

export interface CVEducation {
  degree: string;
  school: string;
  period: string;
}

export interface CVLanguage {
  name: string;
  level: string;
}

export interface CVDoc {
  hero: CVHero;
  summary: string;
  skills: CVSkillGroup[];
  experience: CVRole[];
  projects: CVProject[];
  education: CVEducation[];
  languages: CVLanguage[];
  interests: string[];
  updatedAt?: string;
}
