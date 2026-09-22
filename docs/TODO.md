# TODO & Future Work

## In-code TODOs

**There are no `TODO`, `FIXME`, `HACK`, `XXX` or `@todo` comments in the source.** A
full-repository scan (`src/`, `public/`, config, Docker files, docs) returned no
matches.

```
$ grep -rInE "(TODO|FIXME|HACK|XXX|@todo)" src public next.config.ts Dockerfile docker-compose.yml README.md AGENTS.md
NONE FOUND
```

Likewise, there is no "coming soon", "lorem ipsum", "TBD" or placeholder copy.

## Deferred work (known, not marked in code)

These are genuine gaps identified during delivery, ordered by priority. Each is
documented rather than hidden.

### High priority

| # | Task | Location | Reason | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Add automated tests (unit + E2E) | project-wide | No test suite exists; regressions are currently caught only by manual QA | Choose Vitest + Playwright (`TESTING.md`) | Not started |
| 2 | Add server-side validation + rate limiting for forms | new route handler + `RATE_LIMIT_*` env | Forms validate client-side only | Backend endpoint | Not started |
| 3 | Professional proof-read of the 12 non-English dictionaries | `src/i18n/dictionaries/*.ts` | Translations are machine/author-quality, not reviewed | Native reviewers | Not started |
| 4 | Localize AI Copilot response templates | `src/i18n/dictionaries/en.ts` → `copilot.*` + `engine.ts` | Copilot *content* falls back to English | Translator input | Not started |
| 5 | Tighten CSP with a nonce pipeline | `next.config.ts` + middleware | CSP currently allows `'unsafe-inline'` scripts | Next.js nonce support | Not started |

### Medium priority

| # | Task | Location | Reason | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| 6 | Validate the Docker image | `Dockerfile`, `docker-compose.yml` | Not executed during packaging (no daemon) | Docker host | Not started |
| 7 | Consider `output: "standalone"` for a smaller image | `next.config.ts` + `Dockerfile` | Current image copies full `node_modules` | — | Not started |
| 8 | Add a custom `not-found.tsx` | `src/app/` | Default Next.js 404 is used | Design | Not started |
| 9 | Add a custom `error.tsx` / `global-error.tsx` | `src/app/` | No error boundary UI | Design | Not started |
| 10 | Add CI pipeline | `.github/workflows/` | No CI configured | GitHub repo | Not started |
| 11 | Run Lighthouse and record scores | — | Performance not measured | — | Not started |
| 12 | Cross-browser verification (Firefox/Safari/Edge) | — | Verified in Chromium only | — | Not started |

### Low priority / nice to have

| # | Task | Location | Reason | Dependency | Status |
| --- | --- | --- | --- | --- | --- |
| 13 | Screen-reader audit (NVDA/JAWS/VoiceOver) | project-wide | ARIA implemented but not auditor-verified | Accessibility auditor | Not started |
| 14 | Persist dashboard preferences (tab, filters) | `DashboardPreview` | Currently reset on reload | localStorage | Not started |
| 15 | Real backend for repositories | `src/services/repositories.ts` | Mock data only | Database | Not started |
| 16 | Real authentication | `AuthModal` | UI shell only | Auth provider | Not started |
| 17 | Replace the local copilot engine with a real AI provider | `features/ai-copilot/engine.ts` | Deterministic local engine | `AI_PROVIDER_*` | Not started |
| 18 | Wire analytics / error monitoring | — | None configured | Provider choice | Not started |
| 19 | Add `prettier` for formatting consistency | — | ESLint only | — | Not started |
| 20 | Make the footer year dynamic | `SiteFooter.tsx` | Hardcoded `© 2024` per the reference design | Product decision | Not started |

## Deliberate non-goals

- No database, no auth backend, no external service connections — the site is designed
  to run standalone on mock data. This is intentional, not incomplete.
- No placeholder UI, dead buttons or unfinished sections — every interactive element
  works against the local data layer.
