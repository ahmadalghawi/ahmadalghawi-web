/**
 * Game registry — single source of truth for all mini-games.
 *
 * Adding a new game: create a component, import it here, add a GameDef
 * entry to the `games` array, and register a Command Palette command.
 */
import type { LucideIcon } from 'lucide-react';
import { Swords, Brain, Grid3X3, Bug, Keyboard, Hash } from 'lucide-react';
import Snake from './Snake';
import MemoryMatch from './MemoryMatch';
import Tetris from './Tetris';
import BugHunt from './BugHunt';
import TypingTest from './TypingTest';
import Game2048 from './Game2048';

export interface GameDef {
  slug: string;
  name: string;
  tagline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: LucideIcon;
  accent: string; // Tailwind text colour e.g. 'text-green-400'
  Component: React.FC;
  controls: string[];
  supportsTouch: boolean;
}

export const games: GameDef[] = [
  {
    slug: 'snake',
    name: 'Snake',
    tagline: 'Classic grid-based snake with a retro twist.',
    difficulty: 'Medium',
    icon: Swords,
    accent: 'text-green-400',
    Component: Snake,
    controls: ['Arrow keys', 'WASD', 'Swipe'],
    supportsTouch: true,
  },
  {
    slug: 'memory-match',
    name: 'Memory Match',
    tagline: 'Flip cards, find pairs of tech-stack icons.',
    difficulty: 'Easy',
    icon: Brain,
    accent: 'text-purple-400',
    Component: MemoryMatch,
    controls: ['Click / Tap', 'Tab + Enter'],
    supportsTouch: true,
  },
  {
    slug: 'tetris',
    name: 'Tetris',
    tagline: 'Classic falling blocks with dev-themed colours.',
    difficulty: 'Hard',
    icon: Grid3X3,
    accent: 'text-blue-400',
    Component: Tetris,
    controls: ['Arrow keys', 'WASD', 'Up to rotate'],
    supportsTouch: false,
  },
  {
    slug: 'bug-hunt',
    name: 'Bug Hunt',
    tagline: 'Squash bugs before the timer runs out. Avoid features.',
    difficulty: 'Medium',
    icon: Bug,
    accent: 'text-red-400',
    Component: BugHunt,
    controls: ['Click / Tap', 'Tab + Enter'],
    supportsTouch: true,
  },
  {
    slug: 'typing-test',
    name: 'Typing Test',
    tagline: 'How fast can you type real code? WPM + accuracy.',
    difficulty: 'Easy',
    icon: Keyboard,
    accent: 'text-cyan-400',
    Component: TypingTest,
    controls: ['Keyboard'],
    supportsTouch: false,
  },
  {
    slug: '2048',
    name: '2048',
    tagline: 'Merge tiles and reach the mighty 2048.',
    difficulty: 'Medium',
    icon: Hash,
    accent: 'text-orange-400',
    Component: Game2048,
    controls: ['Arrow keys', 'WASD', 'Swipe'],
    supportsTouch: true,
  },
];

export function getGame(slug: string): GameDef | undefined {
  return games.find((g) => g.slug === slug);
}
