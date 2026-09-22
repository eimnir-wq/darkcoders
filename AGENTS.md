# AGENTS.md — Dark Coders

## Project

Dark Coders — Cybersecurity Operations Platform.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion ·
Recharts · Zod · Lucide. Brand: black + neon green + dark graphite.

## Commands

```bash
npm install
npm run dev        # dev server on http://localhost:5555  (PORT IS ALWAYS 5555)
npm run build
npm run start      # production server on http://localhost:5555
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Always run `npm run lint`, `npm run typecheck` and `npm run build` before declaring
work complete. The app must be served on port **5555** — never 3000.

## Conventions

- **Never hardcode UI copy in components.** All strings resolve through `src/i18n`
  dictionaries via `useI18n()` (`t("path.to.key")` or `dict.section.key`).
  Adding copy means adding a key to `src/i18n/dictionaries/en.ts` (other locales
  fall back to English automatically).
- **Never import raw data arrays into components.** Use repositories in
  `src/services/repositories.ts`.
- **Never use `Math.random()` in render paths.** Mock data uses the seeded
  `mulberry32` PRNG and a fixed `BASE_TIME` in `src/data/mock.ts` for hydration-safe
  determinism.
- **Respect motion preferences** via `useMotionOK()`; content must render in its
  final state when motion is disabled.
- **Accessibility first:** keyboard operability, ARIA roles, focus management,
  ESC handling, and never convey meaning by colour alone.
- Tailwind v4: brand tokens are exposed as `dc-*` colours via `@theme inline` in
  `src/app/globals.css`. Use `dc-card`, `dc-panel`, `dc-chip`, `dc-label` helpers.
- RTL: use logical properties (`ms-*`, `me-*`, `start-*`, `end-*`, `ps-*`, `pe-*`)
  rather than `left/right`. Add `rtl:rotate-180` to directional arrows.
- Do not commit secrets. Use `.env.example` as the template.

## Structure

```
src/app        routes, metadata, robots, sitemap, api/health
src/components layout, providers, ui primitives
src/config     navigation + search index
src/data       deterministic mock data + generated world dots
src/features   feature-scoped components (hero, dashboard, copilot, compliance, …)
src/hooks      shared hooks
src/i18n       locales, provider, server helpers
src/lib        utilities
src/services   repositories
src/types      domain models
src/proxy.ts   locale detection middleware (Next.js proxy convention)
```
