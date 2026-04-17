# Contributing to Portfolio 2026

First off — **thank you** for considering a contribution! 🎉
This project is open source because I believe a nicely themed portfolio template should be available to everyone, and every contribution (big or small, code or docs) makes it better for the whole community.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Message Convention](#commit-message-convention)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be kind. Be patient. Assume good intent.
Harassment, discrimination, or disrespectful behavior of any kind will not be tolerated. If you experience or witness it, please contact the maintainer directly.

---

## Ways to Contribute

You don't need to write code to help:

- 📝 **Improve documentation** — README, `doc/ARCHITECTURE.md`, code comments
- 🎨 **Add a theme** — drop a new CSS variable block in `src/styles/themes.css`
- 🐛 **Report a bug** — open an issue with clear reproduction steps
- ✨ **Suggest a feature** — open a discussion before opening a PR for large ideas
- 🌍 **Translate the UI** — i18n support is on the roadmap; PRs welcome
- 🧪 **Add tests** — the project has no test suite yet; help us start one
- 📸 **Share your fork** — open a PR adding your portfolio URL to a "Made with this template" section in the README

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9+ (or `pnpm` / `yarn`)
- A working install of **Git**

### Setup

```bash
# 1. Fork the repo on GitHub, then clone YOUR fork
git clone https://github.com/YOUR-USERNAME/portfolio2026.git
cd portfolio2026

# 2. Add upstream so you can sync later
git remote add upstream https://github.com/ahmadalghawi/portfolio2026.git

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app should open at <http://localhost:5173>.

### Project structure

See [`doc/ARCHITECTURE.md`](./doc/ARCHITECTURE.md) for a full breakdown of folders, components, hooks, and conventions.

---

## Development Workflow

### 1. Sync your fork

```bash
git checkout main
git fetch upstream
git merge upstream/main
```

### 2. Create a feature branch

Use a descriptive name prefixed with the type of change:

```bash
git checkout -b feat/add-solarized-light-theme
# or
git checkout -b fix/konami-modifier-keys
# or
git checkout -b docs/update-deploy-section
```

**Branch prefixes:**
- `feat/` — new feature
- `fix/` — bug fix
- `docs/` — documentation only
- `style/` — formatting / whitespace
- `refactor/` — code change that neither fixes a bug nor adds a feature
- `perf/` — performance improvement
- `chore/` — build, tooling, dependencies

### 3. Make your changes

- Keep pull requests **focused** — one concern per PR
- Update relevant documentation
- Add types; avoid `any`
- Match the existing code style

### 4. Verify locally

Before pushing, make sure everything still works:

```bash
# Type-check
npx tsc --noEmit -p tsconfig.app.json

# Lint
npm run lint

# Production build must succeed
npm run build
```

### 5. Commit & push

```bash
git add .
git commit -m "feat: add solarized-light theme"
git push origin feat/add-solarized-light-theme
```

### 6. Open a Pull Request

Go to GitHub and open a PR against `main`. Fill in the PR template.

---

## Commit Message Convention

This project follows [**Conventional Commits**](https://www.conventionalcommits.org/).

### Format

```
<type>(<optional scope>): <short summary>

<optional body>

<optional footer>
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, white-space, no code change |
| `refactor` | Code change that isn't a feature or fix |
| `perf` | Performance improvement |
| `test` | Adding or refactoring tests |
| `chore` | Tooling, dependencies, build config |

### Examples

```
feat(themes): add solarized-light theme
fix(konami): ignore shift modifier to allow typing 'B' and 'A'
docs(readme): add Docker deployment instructions
refactor(sidebar): split into ExplorerPanel and GitPanel
perf(github): cache API responses in sessionStorage for 1h
```

---

## Coding Standards

### TypeScript
- **No `any`** — use `unknown` or a proper type
- **Prefer `interface`** for object shapes, `type` for unions/aliases
- **Export types** alongside the component that owns them

### React
- **Functional components only** — no class components
- **One component per file** (small helpers can share)
- **Hooks over HOCs or render-props**
- **Destructure props** and type them with an `interface`

### Styling
- **Tailwind utility classes** for layout and spacing
- **CSS variables** from `themes.css` for any color value — never hardcode hex
- **No inline `style` prop** except for dynamically computed values (e.g. language-color dots)
- Prefer **Framer Motion** over manual CSS keyframes for animations

### File organisation
- Components → `src/components/` (sections nested in `sections/`)
- Reusable logic → `src/hooks/`
- Static data / content → `src/data/`
- Global state → `src/contexts/`

---

## Pull Request Process

1. **Fill out the PR description** — what, why, and screenshots for visual changes
2. **Link related issues** — `Closes #42`
3. **One concern per PR** — split large changes into multiple PRs
4. **Keep commits clean** — squash noisy WIP commits before requesting review
5. **Respond to review comments** — push additional commits; don't force-push until the reviewer approves
6. **Update docs** if your PR changes behavior

Your PR will be merged once:
- ✅ CI passes (build + lint + type-check)
- ✅ At least one maintainer approval
- ✅ No unresolved review comments

---

## Reporting Bugs

Before filing a bug, check if it's already reported in [issues](https://github.com/ahmadalghawi/portfolio2026/issues).

A good bug report includes:

- **Short, descriptive title** — "Hacker mode doesn't trigger on Firefox" beats "bug"
- **Steps to reproduce** (1. Open …  2. Click …  3. Observe …)
- **Expected vs actual behavior**
- **Environment** — OS, browser + version, Node version
- **Screenshots / screen recording** when relevant
- **Console errors** if any

---

## Suggesting Features

1. **Check existing issues** to avoid duplicates
2. **Open a discussion first** for anything non-trivial — we can align on the design before code is written
3. Describe:
   - The problem you're solving (not just the solution)
   - Alternatives you've considered
   - Mock-ups or references if the change is visual

---

## Questions?

- 💬 Open a **Discussion** on GitHub
- 📧 Reach the maintainer at [Ahmadalghawi.86@gmail.com](mailto:Ahmadalghawi.86@gmail.com)

---

**Happy hacking!** 🚀
Thank you for helping make this project better for everyone.
