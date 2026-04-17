# Developer Playground Theme — Style & Structure Guide

> A complete reference for recreating the **VS Code / IDE-inspired Developer Playground** portfolio theme in any project.

---

## Table of Contents

- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Layout Architecture](#layout-architecture)
- [Component Breakdown](#component-breakdown)
- [Data Models](#data-models)
- [Animations & Transitions](#animations--transitions)
- [Interactive Terminal](#interactive-terminal)
- [Section Details](#section-details)
- [Styling Patterns](#styling-patterns)
- [Quick Start Checklist](#quick-start-checklist)

---

## Tech Stack & Dependencies

| Package | Purpose |
|---------|---------|
| **Next.js** (App Router) | Framework — `'use client'` directive for client components |
| **React** | UI library — `useState`, `useEffect` |
| **Framer Motion** | Animations — `motion`, `AnimatePresence` |
| **react-type-animation** | Typing effects — `TypeAnimation` |
| **Lucide React** | Icons — `Terminal`, `FileCode`, `Folder`, `Code`, `Database`, `Server`, `Monitor`, `Mail`, `Github`, `ExternalLink`, `Download`, `GitBranch`, `Play`, `User`, `Briefcase`, `Rocket`, `Coffee`, `Zap`, `Bug`, `Settings` |
| **Tailwind CSS** | Styling — utility-first classes |

---

## Color Palette

### Primary Colors

| Role | Tailwind Class | Hex (approx) | Usage |
|------|---------------|---------------|-------|
| **Background (main)** | `bg-gray-900` | `#111827` | Page & content area background |
| **Sidebar background** | `bg-gray-800` | `#1F2937` | Left sidebar panel |
| **Card background** | `bg-gray-800` | `#1F2937` | Content cards |
| **Inner card / code block** | `bg-gray-900` | `#111827` | Nested content areas |
| **Border** | `border-gray-700` | `#374151` | Card and panel borders |
| **Border (inner)** | `border-gray-600` | `#4B5563` | Inner card borders |

### Accent Colors

| Role | Tailwind Class | Usage |
|------|---------------|-------|
| **Primary text** | `text-green-400` | Default text, terminal output, primary accent |
| **Headings / highlights** | `text-cyan-400` | File names, JSON keys, section titles |
| **Secondary accent** | `text-yellow-400` | JSON property names, folder icons, warnings |
| **Tertiary accent** | `text-blue-400` | File icons, links, GitHub buttons |
| **Code keywords** | `text-purple-400` | JS keywords (`const`, `export`) |
| **Body text** | `text-gray-300` | Descriptions, paragraphs |
| **Muted text** | `text-gray-400` | Hints, secondary info |
| **Dim text** | `text-gray-500` | Comments, markdown syntax |
| **White** | `text-white` | Primary headings, values, terminal commands |

### Button Colors

| Button | Background | Hover | Text |
|--------|-----------|-------|------|
| **Primary (green)** | `bg-green-600` | `bg-green-700` | `text-white` |
| **Secondary (blue)** | `bg-blue-600` | `bg-blue-700` | `text-white` |
| **Neutral** | `bg-gray-600` | `bg-gray-700` | `text-white` |
| **Filter active** | `bg-green-500` | — | `text-black` |
| **Filter inactive** | `bg-gray-700` | `bg-gray-600` | `text-green-400` |

### Traffic Light Dots (Title Bar)

| Color | Class |
|-------|-------|
| Red | `bg-red-500` |
| Yellow | `bg-yellow-500` |
| Green | `bg-green-500` |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| **Global** | `font-mono` | — | — |
| **Page title** | `font-mono` | `text-2xl` | `font-bold` |
| **Section title** | `font-mono` | `text-xl` | `font-bold` |
| **Body text** | `font-mono` | `text-sm` | normal |
| **Terminal text** | `font-mono` | `text-sm` | normal |
| **Code blocks** | `font-mono` | `text-sm` | normal |
| **Sidebar labels** | `font-mono` | `text-xs` | `font-bold tracking-wide` |
| **Tags** | `font-mono` | `text-xs` / `text-sm` | normal |

> **Key:** The entire theme uses `font-mono` — no serif or sans-serif fonts.

---

## Layout Architecture

```
┌─────────────────────────────────────────────────┐
│                  min-h-screen                     │
│                  bg-gray-900                      │
│                  text-green-400                   │
│                  font-mono                        │
│                                                   │
│  ┌──────────┐  ┌──────────────────────────────┐  │
│  │ SIDEBAR  │  │      MAIN CONTENT AREA       │  │
│  │ w-80     │  │      flex-1 p-8              │  │
│  │ bg-gray- │  │      max-w-4xl mx-auto       │  │
│  │ 800      │  │                              │  │
│  │          │  │  ┌──────────────────────┐    │  │
│  │ ┌──────┐ │  │  │   ACTIVE SECTION     │    │  │
│  │ │HEADER│ │  │  │   (switchable)       │    │  │
│  │ │dots  │ │  │  └──────────────────────┘    │  │
│  │ │whoami│ │  │                              │  │
│  │ └──────┘ │  └──────────────────────────────┘  │
│  │          │                                     │
│  │ EXPLORER │  ┌──────────────────────────────┐  │
│  │ file tree│  │      PROJECT MODAL           │  │
│  │          │  │      (AnimatePresence)        │  │
│  │ GIT      │  │      fixed inset-0 z-50      │  │
│  │ STATUS   │  └──────────────────────────────┘  │
│  │          │                                     │
│  │ NAV LINK │                                     │
│  └──────────┘                                     │
│                                                   │
│  ┌──────────────────────────────────────────────┐│
│  │            NAVIGATION FOOTER                  ││
│  └──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

### Flex Layout

```
<div className="min-h-screen bg-gray-900 text-green-400 font-mono">
  <div className="flex">
    <!-- Sidebar: w-80 bg-gray-800 border-r border-gray-700 min-h-screen -->
    <!-- Main:    flex-1 p-8 -->
  </div>
</div>
```

---

## Component Breakdown

### 1. Loading Screen

- **Full screen:** `min-h-screen bg-gray-900 text-green-400 font-mono flex items-center justify-center`
- **Terminal icon** + **spinning border** (`border-2 border-green-400 border-t-transparent rounded-full animate-spin`)
- **TypeAnimation** sequence:
  1. `Initializing developer environment...` → 1s
  2. `Loading portfolio modules...` → 1s
  3. `Compiling creative code...` → 1s
  4. `npm start --portfolio` → 1s
  5. `Ready! Welcome to Developer Playground! 🚀` → 0.5s
- Duration: 2 seconds (`setTimeout`)

### 2. Sidebar (`w-80`)

#### Header Section
- Traffic light dots (red/yellow/green, `w-3 h-3 rounded-full`)
- Label: `portfolio.dev`
- Terminal prompt: `$ whoami` → TypeAnimation with developer name

#### File Explorer
- Title: `EXPLORER` with `Folder` icon (blue-400)
- Branch indicator: `GitBranch` icon (orange-400) + `portfolio-main/`
- **File tree items** (clickable, controls `activeSection` state):

| ID | File Name | Icon | Type |
|----|-----------|------|------|
| `about` | `README.md` | `FileCode` | markdown |
| `experience` | `experience.json` | `Database` | json |
| `skills` | `skills.js` | `Code` | javascript |
| `projects` | `projects.tsx` | `Monitor` | react |
| `contact` | `contact.env` | `Mail` | env |

- Active state: `bg-gray-700 text-cyan-400`
- Hover state: `hover:bg-gray-700 hover:text-white`

#### Git Status Box
- `bg-gray-900 p-3 rounded border border-gray-700`
- Shows: `On branch main` + currently active file name in yellow

#### Navigation Link
- `cd ../main-site` link back to home

### 3. Main Content Area (`flex-1 p-8`)

Content switches based on `activeSection` state. Each section wrapped in `motion.div` with `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`.

### 4. Project Modal

- **Overlay:** `fixed inset-0 bg-black/80 z-50`
- **Modal:** `bg-gray-800 rounded-lg p-6 max-w-2xl border border-gray-700`
- **Animation:** scale from 0.8 → 1 with opacity
- **Content:** title, description, tags, GitHub + Demo buttons
- **Uses:** `AnimatePresence` for enter/exit

### 5. Navigation Footer

- `border-t border-green-500/30 bg-gray-900/50 backdrop-blur-sm`
- Links to all theme pages, separated by `|`
- Link style: `text-green-400 hover:text-green-300 text-sm font-mono underline hover:no-underline`
- Copyright and tagline at bottom

---

## Data Models

### Experience Data (`experienceData.ts`)

```typescript
interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  startDate: string;     // "YYYY-MM"
  endDate: string;       // "YYYY-MM" or "present"
  type: 'freelance' | 'fulltime' | 'technical';
  description: string[];
  skills: string[];
  level: number;         // 1-5 game-style level
  achievements: number;  // Count of key points
}
```

### Projects Data (`projectsData.js`)

```javascript
{
  id: string,
  title: string,
  description: string,
  image: string,          // "/images/projects/name.png"
  tag: string[],          // ["All", "Web", "Mobile"]
  gitUrl: string,
  previewUrl: string
}
```

---

## Animations & Transitions

### Framer Motion Patterns

| Animation | Config |
|-----------|--------|
| **Section enter** | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` |
| **Experience cards** | `initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}` |
| **Project cards** | `initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}` |
| **Modal overlay** | `initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}` |
| **Modal content** | `initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}` |
| **Footer** | `initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}` |
| **Loading spinner** | `border-2 border-green-400 border-t-transparent rounded-full animate-spin` (CSS) |

### TypeAnimation Sequences

- **Loading screen:** Multi-step sequence with 1s delays
- **Sidebar whoami:** Single string, no cursor, no repeat

---

## Interactive Terminal

### Design — Windows Command Prompt Style

```
┌─ Command Prompt - Interactive Resume ──── [−][□][×] ┐
│ bg-blue-600 title bar                               │
├─────────────────────────────────────────────────────┤
│ bg-black                                            │
│ Microsoft Windows [Version 10.0.19045.3570]         │
│ (c) Microsoft Corporation. All rights reserved.     │
│                                                     │
│ C:\Users\Ahmad\Portfolio> [command]                  │
│ [output]                                            │
│                                                     │
│ C:\Users\Ahmad\Portfolio> _                         │
│                                                     │
│ 💡 Available commands: help, resume, skills...      │
└─────────────────────────────────────────────────────┘
```

### Terminal State

```typescript
const [terminalInput, setTerminalInput] = useState('');
const [terminalHistory, setTerminalHistory] = useState<Array<{command: string, output: string[]}>>([]); 
const [commandHistory, setCommandHistory] = useState<string[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);
```

### Available Commands

| Command | Action |
|---------|--------|
| `help` | Show all available commands |
| `whoami` | Display user info |
| `resume` / `cat resume` | Show resume summary |
| `skills` | List technical skills |
| `experience` | Show work history |
| `projects` | List recent projects |
| `contact` | Show contact info |
| `ls` | List fake files |
| `clear` | Clear terminal history |

### Keyboard Features

- **Enter** → Submit command
- **ArrowUp** → Navigate command history backward
- **ArrowDown** → Navigate command history forward

### Title Bar Buttons

| Button | Style |
|--------|-------|
| Minimize (`−`) | `bg-gray-300 hover:bg-gray-200 rounded-sm` |
| Maximize (`□`) | `bg-gray-300 hover:bg-gray-200 rounded-sm` |
| Close (`×`) | `bg-red-500 hover:bg-red-400 rounded-sm` |

---

## Section Details

### About (README.md)

- **Card:** `bg-gray-800 rounded-lg p-6 border border-gray-700`
- **Header:** `FileCode` icon (blue-400) + filename in white
- Content styled as markdown:
  - `# ` prefix (gray-500) → Name (cyan-400, text-2xl, font-bold)
  - `## ` prefix (gray-500) → Title (yellow-400, text-lg)
  - `` ```markdown `` code block wrapper for description
- **Info grid:** 2 columns with `bg-gray-900 p-4 rounded border border-gray-600`
- **Interactive Terminal** below the info card

### Experience (experience.json)

- **Card:** Same as About
- **Header:** `Database` icon (green-400)
- Each experience rendered as JSON:
  ```
  "Company": {
    "title": "...",
    "period": "...",
    "type": "...",
    "skills": [...]
  }
  ```
- **Colors:** Company name → cyan-400, keys → yellow-400, values → white, array items → green-300
- **Staggered animation:** `delay: index * 0.1`

### Skills (skills.js)

- **Header:** `Code` icon (yellow-400)
- Content styled as JS object:
  ```
  const skills = {
    frontend: ['React.js', 'Next.js', ...],
    backend: ['Node.js', 'Express.js', ...],
    mobile: ['React Native', 'Expo', ...],
    tools: ['Git', 'Figma', ...]
  };
  export default skills;
  ```
- **Colors:** `const`/`export` → purple-400, category keys → cyan-400, values → green-300

### Projects (projects.tsx)

- **Header:** `Monitor` icon (blue-400)
- **Filter bar:** Function-styled buttons (`show_all()`, `filter_web()`, `filter_mobile()`)
- **Grid:** `md:grid-cols-2 gap-4`
- **Project cards:**
  - Image area: `h-32 bg-gray-800` with fallback `FileCode` icon
  - Title: `Folder` icon (yellow-400) + name in cyan-400
  - Description: `text-gray-300 text-sm line-clamp-2`
  - Tags: `bg-gray-700 text-green-400 rounded text-xs font-mono`
  - Links: GitHub (blue-400) + Demo (green-400)
- **Shows:** First 8 projects from filtered list
- **Hover:** `hover:border-green-400`

### Contact (contact.env)

- **Header:** `Mail` icon (green-400)
- Content styled as .env file:
  ```
  # Contact Information
  EMAIL=value
  GITHUB=value
  LINKEDIN=value
  LOCATION=value
  ```
- **Colors:** Comment → gray-500, keys → cyan-400, values → green-400
- **Download button:** `bg-green-600 hover:bg-green-700`

---

## Styling Patterns

### Card Pattern

```html
<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
  <!-- Header -->
  <div className="flex items-center gap-3 mb-4">
    <Icon className="text-[accent-color]" size={24} />
    <span className="text-white text-xl font-bold">filename.ext</span>
  </div>
  <!-- Content -->
  <div className="text-green-400 font-mono text-sm">
    ...
  </div>
</div>
```

### Inner Card Pattern

```html
<div className="bg-gray-900 p-4 rounded border border-gray-600">
  ...
</div>
```

### Tag Pattern

```html
<span className="px-2 py-1 bg-gray-700 text-green-400 rounded text-xs font-mono">
  tag
</span>
```

### Link Pattern

```html
<a className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
  <Icon size={14} /> Label
</a>
```

### File-as-Section Pattern

Each section pretends to be a file type:
- **README.md** → Markdown-style with `#` and code blocks
- **experience.json** → JSON object notation
- **skills.js** → JavaScript object syntax
- **projects.tsx** → React component with grid
- **contact.env** → Environment variable format

---

## Quick Start Checklist

1. **Install dependencies:**
   ```bash
   npm install framer-motion react-type-animation lucide-react
   ```

2. **Set up Tailwind CSS** with default config (gray, green, cyan, yellow, blue, purple palettes)

3. **Create data files:**
   - `experienceData.ts` — Experience[] array
   - `projectsData.js` — Project[] array

4. **Build the layout:**
   - Full-screen flex container (`min-h-screen bg-gray-900 text-green-400 font-mono`)
   - Fixed-width sidebar (`w-80 bg-gray-800`)
   - Flexible content area (`flex-1 p-8`)

5. **Implement components:**
   - [ ] Loading screen with TypeAnimation
   - [ ] Sidebar with traffic lights, whoami, file explorer, git status
   - [ ] About section (README.md style)
   - [ ] Interactive Windows CMD terminal
   - [ ] Experience section (JSON style)
   - [ ] Skills section (JS object style)
   - [ ] Projects section with filter + grid + modal
   - [ ] Contact section (.env style)
   - [ ] Navigation footer

6. **Add state management:**
   - `activeSection` — controls which "file" is open
   - `selectedProject` — controls project modal
   - `isLoading` — 2-second loading screen
   - `terminalInput` / `terminalHistory` / `commandHistory` / `historyIndex` — terminal state

7. **Apply animations:**
   - Framer Motion for section transitions, card staggering, modal enter/exit
   - TypeAnimation for loading screen and sidebar whoami
   - CSS `animate-spin` for loading spinner

---

## File Structure

```
app/
├── portfolio/
│   └── page.tsx              # Main Developer Playground page
data/
├── experienceData.ts         # Experience entries
├── projectsData.js           # Project entries
components/
├── UniversalNavigation.tsx    # Shared nav component (optional)
public/
├── images/projects/           # Project screenshots
├── data/Rsume.pdf            # Downloadable resume
```

---

> **Note:** This theme is fully self-contained in a single `page.tsx` file (~900 lines). All sub-components (`renderAbout`, `renderExperience`, etc.) are defined as functions within the main component. The `ThemeNavigationFooter` is a separate component at the bottom of the file.
