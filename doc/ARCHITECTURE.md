# Portfolio 2026 — Architecture & Feature Guide

> A quick-start document for returning to development. Covers project structure, all implemented features, where to find them, and how to add new ones.

---

## 1. Tech Stack

| Layer | Tool |
|---|---|
| Framework | **React 19** + **TypeScript** |
| Build | **Vite 8** |
| Routing | **react-router-dom 7** |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/vite`) + CSS variables |
| Animations | **framer-motion 12** |
| Icons | **lucide-react** |
| Text FX | **react-type-animation** |
| State | **React Context** + `localStorage` |
| Sound | **Web Audio API** (no external deps) |

Scripts (`package.json`):

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b && vite build
npm run preview   # preview built output
npm run lint      # ESLint
```

---

## 2. Folder Structure

```
portfolio2026/
├── doc/                              # documentation
│   ├── ARCHITECTURE.md               # (this file)
│   ├── FUTURE-BACKEND.md             # Firebase roadmap
│   ├── DEVELOPER-PLAYGROUND-THEME.md # original design spec
│   └── CV.md
├── public/                           # static assets
├── src/
│   ├── main.tsx                      # entry — wraps App in <SettingsProvider>
│   ├── App.tsx                       # layout shell, routes, global wiring
│   ├── index.css                     # Tailwind base
│   ├── App.css                       # minor global styles
│   │
│   ├── components/
│   │   ├── ActivityBar.tsx           # far-left VS Code icon rail
│   │   ├── Sidebar.tsx               # switches content per active panel
│   │   ├── TabBar.tsx                # file tabs across the top
│   │   ├── StatusBar.tsx             # bottom blue bar
│   │   ├── CommandPalette.tsx        # Ctrl+Shift+P palette
│   │   ├── SettingsModal.tsx         # theme / font / toggles / shortcuts
│   │   ├── HackerMode.tsx            # cinematic Konami easter egg
│   │   ├── LoadingScreen.tsx         # boot animation
│   │   ├── NotFound.tsx              # 404 page
│   │   ├── PanelViews.tsx            # main-area views for git/ext/terminal
│   │   ├── FullTerminal.tsx          # large terminal used in panel view
│   │   ├── ProblemsPanel.tsx         # bottom problems tab
│   │   ├── ProjectModal.tsx          # project detail popup
│   │   ├── ContactForm.tsx           # contact form (currently client-only)
│   │   ├── GitHubStats.tsx           # GitHub card/stats block
│   │   └── sections/
│   │       ├── About.tsx             # hero + mini terminal
│   │       ├── Skills.tsx
│   │       ├── Projects.tsx
│   │       ├── Experience.tsx
│   │       └── Contact.tsx
│   │
│   ├── contexts/
│   │   └── SettingsContext.tsx       # global settings + persistence
│   │
│   ├── hooks/
│   │   ├── useHotkeys.ts             # keyboard shortcut registration
│   │   ├── useKonami.ts              # ↑↑↓↓←→←→BA detector
│   │   └── useTypingSounds.ts        # Web Audio keypress clicks
│   │
│   ├── data/                         # static content (easy to edit)
│   │   ├── projectsData.ts
│   │   ├── experienceData.ts
│   │   ├── testimonialsData.ts
│   │   ├── nowData.ts
│   │   └── terminalCommands.ts       # shared commands for all terminals
│   │
│   └── styles/
│       └── themes.css                # CSS variable themes + utility overrides
│
├── package.json
├── vite.config.ts
└── tsconfig.*.json
```

---

## 3. The VS Code Layout (how App.tsx is built)

`App.tsx` composes the full IDE-style shell:

```
┌─────────────────────────────────────────────────────┐
│ TabBar                                              │  ← open tabs
├───┬─────────────────┬───────────────────────────────┤
│ A │                 │                               │
│ c │   Sidebar       │     Main Content              │
│ t │  (switches by   │   (sections OR PanelViews)    │
│ i │   activePanel)  │                               │
│ v │                 │                               │
│ B │                 │                               │
│ a │                 │                               │
│ r │                 │                               │
├───┴─────────────────┴───────────────────────────────┤
│ ProblemsPanel (bottom drawer)                       │
├─────────────────────────────────────────────────────┤
│ StatusBar                                           │
└─────────────────────────────────────────────────────┘
```

### Active Panel flow

`App.tsx` holds `activePanel` state (one of `explorer | git | ext | terminal`):

- **explorer** → Sidebar shows file tree; main area shows portfolio sections (`About`, `Skills`, …)
- **git / ext / terminal** → Sidebar shows narrow VS Code-style panel; main area swaps to `PanelViews.tsx`

---

## 4. Features Implemented

### 4.1 Sidebar Panels
File: `src/components/Sidebar.tsx`

- **Explorer** — file tree that routes between sections
- **Source Control** — staged/unstaged changes, commit box, push/pull buttons, branch selector
- **Extensions** — marketplace-style cards with install buttons and search
- **Terminal** — compact session list with mini terminal preview

### 4.2 Panel Main Views
File: `src/components/PanelViews.tsx`

Wide main-content views shown when a non-explorer panel is active:

- Source Control → `now.md`, `recommendations.md`, GitHub stats
- Extensions → themed "installed" cards
- Terminal → `FullTerminal.tsx`

### 4.3 Terminals
Files: `src/components/FullTerminal.tsx`, `src/components/sections/About.tsx` (mini), `src/data/terminalCommands.ts`

Shared command set used by both:

- `help`, `about`, `skills`, `projects`, `experience`, `contact`, `now`, `clear`, `whoami`, `sudo hire-me`, secret `matrix`, etc.
- Supports docking (bottom/right), minimize, close, scanline overlay.

### 4.4 Command Palette
File: `src/components/CommandPalette.tsx`

- Opens with **`Ctrl+Shift+P`** (or `Cmd+Shift+P`)
- Fuzzy search, section navigation, theme switching, Hacker Mode trigger

### 4.5 Settings System
Files: `src/contexts/SettingsContext.tsx`, `src/components/SettingsModal.tsx`, `src/styles/themes.css`

Persisted to `localStorage` under each settings key:

| Setting | Effect |
|---|---|
| `theme` | `dark-plus` / `light-plus` / `monokai` / `dracula` / `solarized` → swaps CSS variables on `<html data-theme>` |
| `fontSize` | `small` / `medium` / `large` |
| `animations` | Disables framer-motion transitions globally |
| `typingSounds` | Enables mechanical keyboard clicks |
| `compactMode` | Tightens spacing everywhere |
| `zenMode` | Hides decorative chrome wrapped in `.zen-hide` |
| `lineNumbers` | Toggles line-number gutters |

Keyboard shortcuts reference and the clickable **Secret** row (triggers Hacker Mode) are inside the modal.

### 4.6 Theming
File: `src/styles/themes.css`

- Each theme is a block of CSS custom properties (`--bg`, `--fg`, `--accent`, etc.).
- Tailwind utility classes (`bg-gray-900`, `text-gray-300`, `border-gray-700`, …) are remapped to the CSS vars so every component themes automatically.
- Compact & Zen modes are also pure CSS overrides — no per-component conditionals.

### 4.7 Typing Sounds
File: `src/hooks/useTypingSounds.ts`

- Uses Web Audio API `OscillatorNode` + `GainNode` — no audio files shipped.
- Slight random pitch variation per press for a mechanical feel.
- Activates only when `settings.typingSounds === true`.

### 4.8 Konami / Hacker Mode
Files: `src/hooks/useKonami.ts`, `src/components/HackerMode.tsx`

Trigger any of three ways:

1. Type **↑ ↑ ↓ ↓ ← → ← → B A** anywhere
2. Click the pulsing red **Secret** row in Settings
3. Command Palette → "Developer: Trigger Hacker Mode"

What runs:

- Glitch flash → canvas matrix rain → typed intrusion log (25 color-coded lines) → 4 exploit progress bars → hex packet stream → "ACCESS GRANTED" reveal.
- Dismiss with `Esc`, `Enter`, or click.

### 4.9 Loading Screen
File: `src/components/LoadingScreen.tsx`

Boot-style animation (compile log → progress → pop).

### 4.10 Routing
- `/` main app
- `*` → `NotFound.tsx` (styled as a 404 error panel)

---

## 5. How to Add New Features

### Add a new portfolio section
1. Create `src/components/sections/YourSection.tsx`.
2. Add a file-tree entry in `Sidebar.tsx` (explorer panel).
3. Register the route/section in `App.tsx`.
4. Consider adding a command palette action (`src/components/CommandPalette.tsx`).

### Add a new setting
1. Extend the interface + default + `useState` in `src/contexts/SettingsContext.tsx`.
2. Add a toggle/select in `src/components/SettingsModal.tsx`.
3. If it needs CSS side-effects → add a rule in `src/styles/themes.css` keyed off `<html data-[name]>` or a class.

### Add a new theme
1. Add a new `[data-theme="name"] { --bg: ...; --fg: ...; ... }` block in `themes.css`.
2. Add its label/id in the theme picker inside `SettingsModal.tsx`.

### Add a new terminal command
Edit the `COMMANDS` object in `src/data/terminalCommands.ts` — both terminals pick it up automatically.

### Add a new keyboard shortcut
1. Register in `src/hooks/useHotkeys.ts` (or wherever you're consuming it).
2. Document it in the **Keyboard Shortcuts** section of `SettingsModal.tsx`.

---

## 6. Known Quirks / Gotchas

- **`.zen-hide` wrapper** uses `display: contents` to avoid breaking flex layouts when wrapping children.
- **Konami hook** ignores modifier keys (Shift, Ctrl, Alt, Meta, CapsLock, Tab, Escape) — needed because reaching `B`/`A` often involves Shift.
- **Tailwind v4**: CSS variables are declared in `themes.css`, *not* in `tailwind.config`. Utility classes are overridden directly.
- **Audio context** must be resumed on first user gesture — `useTypingSounds` handles this lazily.
- The **ContactForm** is currently display-only — no backend wired yet (see `FUTURE-BACKEND.md`).

---

## 7. Returning to Development — Quick Checklist

```bash
cd "c:\LexCourse\main project\portfolio2026"
npm install            # if node_modules missing
npm run dev            # http://localhost:5173
```

Top things to tweak first:

- Content → `src/data/*.ts`
- Personal links/email → `src/components/sections/Contact.tsx`, `src/data/terminalCommands.ts`
- Themes/colors → `src/styles/themes.css`
- Layout → `src/App.tsx`

Run a type check before committing:

```bash
npx tsc --noEmit -p tsconfig.app.json
```

---

*See `FUTURE-BACKEND.md` for Firebase integration roadmap and ideas.*
