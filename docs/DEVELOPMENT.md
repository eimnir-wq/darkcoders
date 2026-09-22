# Development

## Prerequisites

- Node.js 22.23.2 (see `REPRODUCIBILITY.md`)
- npm 10.x
- No database, Docker, or external service required for local development

## Setup

```bash
cd source
npm ci
cp .env.example .env.local      # optional; defaults work
npm run dev                     # http://localhost:5555
```

## Scripts

| Command | Purpose | When to use | Expected result |
| --- | --- | --- | --- |
| `npm run dev` | Start dev server with HMR on **port 5555** | Day-to-day development | Server ready in < 1 s; http://localhost:5555 returns 200 |
| `npm run build` | Production build (Turbopack) | Before deploying / verifying | `.next/` produced; "Compiled successfully"; ~25 s |
| `npm run start` | Serve the production build on **port 5555** | After `build`, to verify production | Server ready; http://localhost:5555 returns 200 |
| `npm run lint` | ESLint (Next core-web-vitals + TS) | Before committing | No output = clean |
| `npm run typecheck` | `tsc --noEmit` | Before committing | No output = clean |

There is **no `test` script** — the project contains no automated test suite
(see `TESTING.md`).

> **Port note:** the scripts are pinned with `-p 5555`. Do not run on 3000. If you must
> change it, update both `dev` and `start` in `package.json` and `NEXT_PUBLIC_SITE_URL`
> in `.env.local`.

## Development workflow

1. **Edit feature components** under `src/features/<area>/`.
2. **Never hardcode copy** — add keys to `src/i18n/dictionaries/en.ts`. Other locales
   fall back to English automatically via `deepMerge` in
   `src/i18n/dictionaries/index.ts`.
3. **Never import mock arrays directly** into components — go through
   `src/services/repositories.ts`.
4. **Never use `Math.random()`** in a render path — use the seeded PRNG in
   `src/data/mock.ts`.
5. **Respect motion preferences** — use `useMotionOK()` before animating.
6. Run `npm run lint && npm run typecheck` before finishing.

## Adding a new section

1. Create `src/features/<name>/<Name>Section.tsx` with `"use client"` if it needs i18n
   or interactivity.
2. Add copy keys to `src/i18n/dictionaries/en.ts`.
3. Compose it in `src/app/page.tsx` with an `id` for anchor navigation.
4. If it belongs in the nav, add an entry to `src/config/nav.ts`.
5. Optionally add it to `src/config/nav.ts` → `searchIndex` for search discoverability.

## Adding a language

1. Copy `src/i18n/dictionaries/en.ts` → `src/i18n/dictionaries/<code>.ts`.
2. Translate the values; export `const <code>: PartialDictionary`.
3. Register it in `src/i18n/config.ts` (`locales`, `localeMeta`) and in
   `src/i18n/dictionaries/index.ts` (`dictionaries`).
4. No component changes required. Arabic-style RTL is driven by
   `localeMeta[code].dir`.

## Adding a form

1. Add a Zod schema to `src/features/forms/schemas.ts`.
2. Add copy keys (`forms.*`) to the dictionary.
3. Build the form with `Field` + `Input`/`Textarea` from `src/components/ui/Field.tsx`
   and submit via `schema.safeParse(...)`, mapping issue paths to field errors.
4. Report success with `useToast()`.

## Debugging tips

- **Hydration warnings** — check you did not introduce `Math.random()`/`Date.now()` in
  render; use the seeded data helpers.
- **Locale not changing** — clear the `dc.locale` cookie and the
  `dc.locale` localStorage key.
- **Fonts missing offline** — the first `npm run build` needs network for
  `next/font/google`; see `FONTS.md`.
- **RTL layout issues** — use logical properties (`ms-*`, `me-*`, `start-*`, `end-*`,
  `ps-*`, `pe-*`) instead of `left/right`.

## Repository conventions

See `AGENTS.md` for the condensed convention list intended for contributors and
coding agents.
