# Dependencies

Installed versions are from `package-lock.json`. Do not remove a dependency without
verifying its usage — several are easy to miss (e.g. Tailwind v4 needs its PostCSS
plugin; Lucide brand icons were replaced with custom SVGs, but the library is still
used for ~40 icons).

## Production dependencies

| Package | Version | Why it exists | Used in |
| --- | --- | --- | --- |
| `next` | 16.3.5 | Framework: App Router, routing, metadata, image, font, build | everywhere |
| `react` | 19.2.8 | UI runtime | everywhere |
| `react-dom` | 19.2.8 | DOM renderer | `app/layout` |
| `framer-motion` | 13.4.0 | Interactive transitions: modal, toast, mobile drawer, dropdowns, copilot messages | `ui/Modal`, `ui/Toast`, `layout/*`, `ai-copilot/CopilotPanel` |
| `lucide-react` | 1.47.0 | Icon set (~40 icons + registry) | `ui/Icon`, features, layout |
| `recharts` | 3.10.1 | Area chart for "Live Threat Activity" | `dashboard/ThreatActivityChart` |
| `zod` | 4.6.5 | Form schema validation | `features/forms/schemas.ts`, `AuthModal`, `SiteFooter` |
| `clsx` | 2.1.1 | Conditional class composition | `lib/utils.ts` |
| `tailwind-merge` | 3.7.0 | Resolves conflicting Tailwind classes in `cn()` | `lib/utils.ts` |

## Development dependencies

| Package | Version | Why it exists |
| --- | --- | --- |
| `tailwindcss` | 4.3.3 | Utility CSS engine (CSS-first `@theme` config) |
| `@tailwindcss/postcss` | 4.3.3 | **Required** PostCSS plugin for Tailwind v4 (`postcss.config.mjs`) |
| `typescript` | 5.9.3 | Type checking / language services |
| `@types/node` | 20.19.43 | Node typings (`process`, etc.) |
| `@types/react` | 19.3.0 | React typings |
| `@types/react-dom` | 19.3.0 | React DOM typings |
| `eslint` | 9.39.5 | Linting (flat config) |
| `eslint-config-next` | 16.3.5 | Next.js core-web-vitals + TypeScript rules |

## Optional / transitive notes

- `@tailwindcss/oxide-*` and `@next/swc-*` are **optional platform binaries** installed
  automatically by `npm ci` for the host OS/arch. Do not copy `node_modules` between
  platforms.
- The lockfile contains optional WASM fallbacks for Tailwind's oxide engine.

## Peer dependencies

No package declares an unmet peer dependency. `recharts@3` and `framer-motion@13`
support React 19 (verified by a clean `npm ci` and successful build).

## Not installed (deliberately)

`prisma`, `@prisma/client`, `next-auth`/`@auth/core`, `next-intl`, `i18next`,
`mapbox-gl`, `maplibre-gl`, `leaflet`, `three`, `@react-three/*`, `vitest`, `jest`,
`@playwright/test`, `cypress`, `prettier`, `zustand`, `@tanstack/react-query`,
`swr`, `axios`.

## Adding a dependency

```bash
npm install <pkg>            # updates package.json + lockfile
npm run typecheck && npm run lint && npm run build
```

Prefer zero-dependency solutions where the existing design system already covers the
need (this project implements its own i18n, map and globe rather than pulling in heavy
libraries).

## Security

`npm audit` → **0 vulnerabilities** at packaging time. Re-run `npm audit` after any
dependency change. See `SECURITY-REVIEW.md`.
