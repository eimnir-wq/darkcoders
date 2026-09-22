# Testing

## Status: NO AUTOMATED TEST SUITE

The project contains **no unit, integration or E2E tests**, and no test runner is
installed. This is a factual statement about the delivered codebase — not an
oversight to hide.

| Type | Present | Runner |
| --- | --- | --- |
| Unit tests | ❌ | — |
| Integration tests | ❌ | — |
| E2E / browser tests | ❌ | — |
| Snapshots | ❌ | — |
| Coverage config | ❌ | — |
| Test fixtures/utilities | ❌ | — |

There is **no `test` script** in `package.json`.

## What was verified instead

Quality was verified by running the real gates and a manual/automated browser pass:

1. `npm run lint` — PASS
2. `npm run typecheck` — PASS
3. `npm run build` — PASS
4. `npm run start` + `GET /api/health` — PASS
5. Headless-Chrome interaction checks (tabs, filters, copilot, search, modal, forms,
   integration toggles, language switch → RTL) — PASS
6. Console-error check on the production build — no errors
7. Responsive sweep 320 → 2560 px — no horizontal overflow
8. Reference screenshots captured for desktop / tablet / mobile

Details and raw results: `QA-REPORT.md` and `docs/verification/build-result.txt`.

## Recommended test strategy (to be added)

### Unit / component — Vitest + React Testing Library

Best first targets (pure logic, no DOM needed):

| Target | What to assert |
| --- | --- |
| `src/features/ai-copilot/engine.ts` | `answerSecurityQuery` returns the right intent per keyword, in every supported language; confidence and sources present; fallback path |
| `src/i18n/dictionaries/index.ts` | `deepMerge` fallback; every locale resolves every English key |
| `src/lib/utils.ts` | `cn`, `formatNumber`, `timeAgo`, `severityVar` |
| `src/services/repositories.ts` | filters, counts, averages, `StatisticsService` |
| `src/data/mock.ts` | determinism (two calls with the same seed produce identical output) |
| `src/features/forms/schemas.ts` | valid/invalid payloads for all four schemas |

### Component tests

- `Reveal` renders children visible when motion is off.
- `Modal` closes on `Escape`, traps focus, restores focus.
- `DashboardPreview` switches panels and filters rows.
- `LanguageSwitcher` changes `document.documentElement.dir`.

### E2E — Playwright

Suggested specs (mirroring the QA pass):

1. Home loads, hero visible, health endpoint returns ok.
2. Nav dropdown opens/closes; mobile drawer opens, `Escape` closes.
3. Search: ⌘K opens, query filters, Enter navigates.
4. Dashboard: 11 tabs, severity filter narrows rows, export triggers a download.
5. Copilot: quick action produces an assistant message.
6. Forms: empty submit shows errors; valid submit shows a toast.
7. i18n: switch to Arabic → `dir="rtl"`, `lang="ar"`; persists on reload.
8. Responsive: no horizontal overflow at 390 / 768 / 1440.

### Setup commands (when added)

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/dom jsdom
# package.json
#   "test": "vitest run",
#   "test:watch": "vitest"

npm install -D @playwright/test
npx playwright install --with-deps
#   "test:e2e": "playwright test"
```

## Manual test checklist

See `QA-REPORT.md` — every item there was executed against the running build and can be
re-run by hand.
