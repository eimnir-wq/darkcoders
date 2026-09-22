# Handover Status

Honest classification of the delivered application. Nothing below is overstated.

---

## CURRENTLY WORKING

Verified against the production build (see `QA-REPORT.md`).

### Application
- Full single-page site renders on `/` with all 11 sections in the reference order.
- Production build succeeds; dev and production servers both run on port 5555.
- `/api/health` returns `{"status":"ok",…}`.
- No console errors on the production build, including after interactions.

### Design & content
- Dark/neon-green design system driven by CSS variables in `globals.css`.
- Brand logo rendered from the supplied asset (`public/brand/*`), no redesign.
- Responsive from 320 px to 2560 px with no horizontal overflow (13/13 widths verified).
- 13 locales with RTL Arabic; language persists and re-renders the whole UI.
- Reduced-motion support; content is never hidden when animation is unavailable.

### Interactivity
- Header dropdowns, mobile drawer, search dialog (⌘K), language switcher.
- Hero globe (rotating), live threat panel (deterministic feed), metric counters.
- Interactive world threat map with selectable nodes.
- Compliance grid + AI Copilot (8 intents + fallback, quick actions, free text).
- 11-tab dashboard: filters, tables, area chart, sparklines, MITRE heatmap,
  report export (Blob download), integration toggles, settings switches.
- Four validated forms (newsletter, demo, trial, login) with error + success states.
- SEO: metadata, OpenGraph, Twitter cards, robots, sitemap, `Organization` JSON-LD.

### Security baseline
- Security headers + CSP, HSTS, `nosniff`, `DENY` framing, referrer + permissions policy.
- No secrets committed; `.env.example` documents the integration surface.
- Zero `npm audit` vulnerabilities.

---

## PARTIALLY IMPLEMENTED

| Area | What works | What is missing |
| --- | --- | --- |
| Internationalization | 13 locales, RTL, persistence, all UI copy localized | Non-English copy not proof-read; **Copilot response content is English-only** |
| CSP | Headers applied globally | Uses `'unsafe-inline'` for scripts/styles (Next.js hydration); no nonce pipeline |
| Rate limiting | Env vars reserved (`RATE_LIMIT_*`) | No implementation (no endpoint currently needs it) |
| CSRF | Not exploitable today (no state-changing endpoints) | No explicit tokens; required once write APIs exist |
| Forms | Client-side Zod validation, error/success UX | No server-side validation or submission endpoint |
| Dashboard settings | Language, reduce-motion, alerts toggles work in-session | Preferences are not persisted across reloads |
| AI Copilot | Deterministic local engine, 8 intents, grounded in mock data | Not connected to an external LLM; content not localized |

---

## NOT IMPLEMENTED

These are intentional gaps for a static marketing + preview site:

| Area | Status | Note |
| --- | --- | --- |
| Authentication | Not implemented | `AuthModal` is a UI shell with validation only |
| Authorization / RBAC | Not implemented | No protected resources |
| Database / ORM / migrations | Not implemented | Data is in-memory (`src/data/mock.ts`) |
| Server-side sessions | Not implemented | — |
| Audit logging | Not implemented | — |
| Automated tests | Not implemented | No runner, no tests |
| CI/CD | Not implemented | No workflows |
| Analytics / monitoring | Not implemented | — |
| Payments / email | Not implemented | — |
| Real SIEM/SOAR/OpenSearch/MinIO | Not implemented | Modelled in the Integrations tab + env vars |
| Custom 404 / error boundaries | Not implemented | Next.js defaults used |

---

## KNOWN LIMITATIONS

1. **Copilot content is English-only** even when the UI is in another language.
2. **Non-English translations are unreviewed** — treat as draft for public launch.
3. **CSP allows `'unsafe-inline'`** — acceptable, not maximal.
4. **No automated tests** — quality relies on the documented manual QA pass.
5. **Docker image untested** (no daemon on the packaging machine).
6. **Chromium-only verification** — Firefox/Safari not exercised.
7. **No custom 404/error UI**.
8. **Footer year hardcoded** (`© 2024`) to match the reference design.
9. **Mock data is fictional** — no real customer, incident or certification data. The
   compliance section explicitly states frameworks are *supported*, not certified.

---

## KNOWN BUGS

**None reported.** The QA pass (`QA-REPORT.md`) recorded no failures: all 13 responsive
widths and all 12 interaction tests passed, with no console errors.

---

## FUTURE WORK

Prioritized list in `TODO.md`. Highlights:

- Add Vitest + Playwright suites and wire them into CI.
- Server-side form validation + rate limiting.
- Localize Copilot responses; professional translation review.
- Nonce-based CSP.
- Validate Docker in a real daemon; consider `output: "standalone"`.
- Add custom 404/error pages and Lighthouse/cross-browser verification.
- When a backend is introduced: Prisma + PostgreSQL, Auth.js/Keycloak, and swap
  `src/services/repositories.ts` to async data access (the designed seam).

---

## Production-readiness statement

The application is **production-ready as a static marketing + interactive preview
site** that runs on mock data with no backend. It is **not** a production security
console: authentication, authorization, persistence and server-side validation are not
implemented. Do not expose the dashboard preview as a real operations console without
first implementing those layers (see `SECURITY.md` → recommendations).
