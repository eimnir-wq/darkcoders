# QA Report

All results below are **actual observed results** from the delivered build. Nothing is
inferred. Environment: macOS 26.6.1 arm64, Node v22.23.2, npm 10.9.8, Next.js 16.3.5.

**Legend:** PASS · PARTIAL · FAILED · NOT TESTED

---

## 1. Build & quality gates

| Check | Command | Result | Evidence |
| --- | --- | --- | --- |
| Install | `npm ci` | **PASS** | clean install, lockfile honoured |
| Lint | `npm run lint` | **PASS** | no output (0 errors, 0 warnings) |
| Typecheck | `npm run typecheck` | **PASS** | no output |
| Production build | `npm run build` | **PASS** | "Compiled successfully"; 7 routes generated |
| Dependency audit | `npm audit` | **PASS** | 0 vulnerabilities |
| Dev server | `npm run dev` | **PASS** | ready in <1s on :5555 |
| Production server | `npm run start` | **PASS** | ready on :5555, no warnings |
| Health endpoint | `GET /api/health` | **PASS** | `{"status":"ok","service":"dark-coders-web","version":"1.0.0",…}` |
| Home page | `GET /` | **PASS** | HTTP 200, ~111 ms response |
| Console errors (prod, after interactions) | CDP `Runtime`/`Log` capture | **PASS** | `NO_CONSOLE_ERRORS` |

Build output routes:

```
┌ ƒ /                  (dynamic — layout awaits cookies())
├ ƒ /_not-found
├ ƒ /api/health
├ ○ /apple-icon.png
├ ○ /icon.png
├ ○ /robots.txt
└ ○ /sitemap.xml
ƒ Proxy (Middleware)
```

---

## 2. Responsive sweep (headless Chrome, production build)

Measured `document.documentElement.scrollWidth` vs `innerWidth` at 13 widths.

| Width | Overflow | Header nav | Hamburger | Result |
| --- | --- | --- | --- | --- |
| 320 | none | hidden | shown | **PASS** |
| 360 | none | hidden | shown | **PASS** |
| 375 | none | hidden | shown | **PASS** |
| 390 | none | hidden | shown | **PASS** |
| 414 | none | hidden | shown | **PASS** |
| 430 | none | hidden | shown | **PASS** |
| 768 | none | hidden | shown | **PASS** |
| 820 | none | hidden | shown | **PASS** |
| 1024 | none | shown | hidden | **PASS** |
| 1280 | none | shown | hidden | **PASS** |
| 1440 | none | shown | hidden | **PASS** |
| 1920 | none | shown | hidden | **PASS** |
| 2560 | none | shown | hidden | **PASS** |

**13/13 PASS.** No horizontal overflow at any width.

---

## 3. Functional interaction tests (CDP-driven, production build)

| # | Test | Observed result | Result |
| --- | --- | --- | --- |
| 1 | Dashboard tab list present | 11 tabs found | **PASS** |
| 2 | Click "Threats" tab | panel rendered 12 rows | **PASS** |
| 3 | Click "Critical" severity filter | rows narrowed to 4 | **PASS** |
| 4 | Copilot quick action "Summarize today's threats" | assistant response containing "critical incidents" | **PASS** |
| 5 | Search button opens dialog | `role="dialog"` present | **PASS** |
| 6 | Type "compliance" in search | 3 results | **PASS** |
| 7 | Click header "Start Free Trial" | auth modal opened | **PASS** |
| 8 | Submit empty auth form | validation errors rendered (`role="alert"`) | **PASS** |
| 9 | `Escape` closes modal | modal removed from DOM | **PASS** |
| 10 | Newsletter empty submit | `#newsletter-error` rendered | **PASS** |
| 11 | Integrations tab | 12 toggle buttons (`aria-pressed`) | **PASS** |
| 12 | Switch language to العربية | `documentElement.dir="rtl"`, `lang="ar"` | **PASS** |

**12/12 PASS.**

---

## 4. Visual verification (reference screenshots)

Captured from the running production build at `http://localhost:5555` (see
`docs/screenshots/`).

| Viewport | Captures | Result |
| --- | --- | --- |
| Desktop 1440×900 | homepage (full), hero, nav dropdown, dashboard, copilot, search, auth modal | **PASS** |
| Tablet 768×1024 | homepage (full), hero, dashboard | **PASS** |
| Mobile 390×844 | homepage (full), hero, nav drawer, dashboard | **PASS** |

Reviewed content: brand logo renders from the supplied asset; hero headline + green
"Strike."; live intelligence panel populated; counters animate to final values
(250M+, 180+, 50+, <0.9s); capability cards; dot-matrix world map with nodes/arcs;
compliance tiles; copilot; trust section; architecture flow; dashboard chart, KPIs,
MITRE heatmap; scale section; CTA; footer with newsletter and social icons.

---

## 5. Feature-level status

| Area | Result | Notes |
| --- | --- | --- |
| Navigation (desktop dropdowns) | **PASS** | hover + click + `Escape` + outside-click |
| Mobile navigation drawer | **PASS** | accordion, `Escape`, backdrop, scroll lock |
| Hero + globe | **PASS** | globe renders and rotates (static under reduced motion) |
| Live threat panel | **PASS** | deterministic feed + stat ticks |
| Metric counters | **PASS** | animate on viewport entry |
| Capabilities | **PASS** | 5 cards, hover glow |
| Threat map | **PASS** | interactive nodes, tooltip, selected-node callout |
| Top threats + "View Live Map" | **PASS** | scrolls to map |
| Compliance tiles | **PASS** | 11 frameworks, coverage bars, status pills |
| AI Copilot | **PASS** | 8 intents + fallback; quick actions; free text |
| Trust section | **PASS** | labelled illustrative placeholders |
| Architecture flow | **PASS** | 7 stages |
| Dashboard (11 tabs) | **PASS** | all tabs render; filters work |
| Charts | **PASS** | area chart + sparklines render (animation disabled) |
| MITRE heatmap | **PASS** | 12 tactics × 4 techniques |
| Reports export | **PASS** | Blob download triggered |
| Integration toggles | **PASS** | local state, `aria-pressed` |
| Settings switches | **PASS** | language, reduce-motion, alerts |
| Search dialog | **PASS** | filters index + frameworks |
| Auth modal (login/trial/demo) | **PASS** | validation, mode switching |
| Newsletter validation | **PASS** | error + success toast |
| Language switching (13) | **PASS** | persistence + RTL |
| RTL layout (Arabic) | **PASS** | mirrored, no overflow |
| Reduced motion | **PASS** | content renders in final state |
| SEO routes | **PASS** | `/robots.txt`, `/sitemap.xml` return valid output |
| Structured data | **PASS** | `Organization` JSON-LD present |
| Health API | **PASS** | returns ok |

---

## 6. Not tested / out of scope

| Item | Status | Reason |
| --- | --- | --- |
| Docker build & run | **NOT TESTED** | No Docker daemon on the packaging machine |
| Automated test suite | **NOT TESTED** | No test suite exists in the project |
| Cross-browser (Firefox/Safari/Edge) | **NOT TESTED** | Verified in Chromium only |
| Screen-reader walkthrough (NVDA/JAWS/VoiceOver) | **NOT TESTED** | ARIA implemented, not auditor-verified |
| Lighthouse performance score | **NOT TESTED** | No Lighthouse run performed |
| Load / stress testing | **NOT TESTED** | Out of scope for a static marketing site |
| Real authentication | **NOT TESTED** | No auth backend exists |
| Production TLS / DNS | **NOT TESTED** | Deployment-environment concern |
| Non-English copy proof-reading | **PARTIAL** | Translations present; not professionally reviewed |

---

## 7. Known issues

1. **CSP uses `'unsafe-inline'`** for scripts/styles (Next.js hydration). Acceptable
   but not maximal; see `SECURITY.md`.
2. **Copilot response text is English-only.** UI is localized in 13 languages, but the
   generated *content* falls back to English (documented in `I18N.md`).
3. **`next start` vs standalone** — the project intentionally does **not** use
   `output: "standalone"`, so the Docker image copies `node_modules`. Fine, but larger
   than a standalone build.
4. **No custom 404 page** — Next.js default not-found is used.
5. **Footer year is hardcoded** (`© 2024 DarkCoders`) per the reference design.

None of these block the delivered functionality.

---

## 8. Reproduction test

A fresh-environment reproduction test was performed on the packaged source: copy →
`npm ci` → `npm run build` → `npm run start` → verify `/` and `/api/health`. See
`docs/verification/build-result.txt` for the captured output. Result: **PASS**.
