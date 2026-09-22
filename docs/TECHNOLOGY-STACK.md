# Technology Stack

Every version below was read from the installed packages / lockfile, not assumed.

## Runtime & tooling

| Item | Value | Source |
| --- | --- | --- |
| Operating system (packaged on) | macOS 26.6.1 (build 25G76), arm64 | `sw_vers` / `uname -m` |
| Node.js | **v22.23.2** | `node -v` |
| npm | **10.9.8** | `npm -v` |
| Package manager | **npm** (lockfile v3) | `package-lock.json` |
| Build tool | **Next.js compiler (Turbopack)** | `next build` output |
| Language | **TypeScript 5.9.3** | lockfile |
| JSX runtime | `react-jsx` | `tsconfig.json` |
| Module resolution | `bundler` | `tsconfig.json` |
| Path alias | `@/* → src/*` | `tsconfig.json` |

## Framework & libraries

| Category | Package | Version | Notes |
| --- | --- | --- | --- |
| Framework | `next` | 16.3.5 | App Router, Turbopack build |
| UI runtime | `react` | 19.2.8 | |
| UI runtime | `react-dom` | 19.2.8 | |
| Styling | `tailwindcss` | 4.3.3 | CSS-first config via `@theme` |
| Styling | `@tailwindcss/postcss` | 4.3.3 | PostCSS plugin |
| Animation | `framer-motion` | 13.4.0 | Interactive transitions |
| Charts | `recharts` | 3.10.1 | Area chart, sparklines |
| Icons | `lucide-react` | 1.47.0 | Icon library (brand icons removed in v1 → custom SVGs) |
| Validation | `zod` | 4.6.5 | Form schemas |
| Class utils | `clsx` | 2.1.1 | Conditional classes |
| Class utils | `tailwind-merge` | 3.7.0 | Class conflict resolution |
| Linting | `eslint` | 9.39.5 | Flat config |
| Linting | `eslint-config-next` | 16.3.5 | core-web-vitals + TS rules |
| Types | `@types/node` | 20.19.43 | |
| Types | `@types/react` | 19.3.0 | |
| Types | `@types/react-dom` | 19.3.0 | |

## Explicitly NOT used

| Category | Status |
| --- | --- |
| UI component library (shadcn/MUI/Chakra) | **Not used** — bespoke design system |
| CSS-in-JS | **Not used** — Tailwind v4 + CSS variables |
| Map library (MapLibre/Leaflet/Mapbox) | **Not used** — custom SVG dot-matrix map from Natural Earth data |
| 3D library (Three.js) | **Not used** — custom SVG orthographic globe projection |
| State manager (Redux/Zustand/Jotai) | **Not used** — local state + React context |
| Data fetching (SWR/React Query) | **Not used** — synchronous repository access |
| Database / ORM (Prisma/Drizzle) | **Not used** |
| Auth library (Auth.js/NextAuth) | **Not used** — UI shell only |
| Test runner (Vitest/Jest) | **Not used** |
| E2E (Playwright/Cypress) | **Not used** |
| i18n library (next-intl/i18next) | **Not used** — bespoke dictionary system |
| Prettier | **Not used** |
| Analytics / monitoring SDK | **Not used** |

## Why these choices

- **Tailwind v4 + CSS variables** — the brand identity is token-driven
  (`--dc-*`); `@theme inline` exposes the tokens as Tailwind utilities, keeping the
  design system in one file (`src/app/globals.css`).
- **Custom SVG map/globe** — the reference design calls for a glowing dot-matrix
  world map and a rotating wireframe globe. Rendering these from real geographic data
  as SVG avoids a heavy map/3D dependency, works offline, and matches the visual
  exactly. See `VISUAL-REPRODUCTION.md`.
- **Recharts** — the only charting need is an area chart plus sparklines; Recharts
  integrates cleanly with React 19 and the existing token colours.
- **Zod** — schema-first validation with typed inference for the four forms.
- **Framer Motion (partial)** — reserved for interactive transitions; scroll reveals
  are CSS-based for reliability (see `ARCHITECTURE.md`).
