# Project Inventory

Forensic inventory of the Dark Coders project at delivery time.

- **Total tracked files (excluding `node_modules/`, `.next/`):** 96
- **Source size:** ~996 KB (excluding `node_modules/`, `.next/`)
- **TypeScript/TSX source files:** 77 (under `src/`)
- **Lines of application code (approx.):** ~11,500

---

## Root files

| File | Lines | Purpose |
| --- | --- | --- |
| `package.json` | 34 | Project metadata, scripts, dependencies |
| `package-lock.json` | 7299 | Exact dependency lockfile (npm v3) — required for `npm ci` |
| `tsconfig.json` | 34 | TypeScript config, `@/*` path alias to `src/*` |
| `next.config.ts` | 46 | Next.js config: security headers, CSP, image/package optimisation |
| `postcss.config.mjs` | 7 | PostCSS with `@tailwindcss/postcss` (Tailwind v4) |
| `eslint.config.mjs` | 18 | ESLint flat config: Next.js core-web-vitals + TypeScript |
| `next-env.d.ts` | 7 | Next.js ambient types (generated) |
| `Dockerfile` | 44 | Multi-stage production image, port 5555, healthcheck |
| `docker-compose.yml` | 32 | `web` service, `5555:5555`, healthcheck, network |
| `.dockerignore` | 21 | Docker build context exclusions |
| `.gitignore` | 42 | VCS exclusions (node_modules, .next, env files) |
| `.env.example` | 45 | Environment template — **no secrets** |
| `README.md` | 189 | Project overview, quick start, architecture summary |
| `AGENTS.md` | 58 | Contributor/agent conventions |
| `CLAUDE.md` | 1 | Pointer to `AGENTS.md` |

## `public/` — static assets

| File | Purpose |
| --- | --- |
| `public/brand/darkcoders-logo.png` | Full logo: green chevron mark + white "Dark Coders" wordmark, transparent, 2134×308 |
| `public/brand/darkcoders-mark.png` | Chevron mark only, transparent, 220×308 |
| `public/brand/icon-32.png` | 32×32 favicon source |

## `src/app/` — App Router

| File | Purpose |
| --- | --- |
| `layout.tsx` | Root layout: fonts, metadata, providers, header/footer shell |
| `page.tsx` | Home page composition + `Organization` JSON-LD |
| `globals.css` | Design system: CSS variables, Tailwind `@theme`, component classes, keyframes |
| `robots.ts` | `robots.txt` route |
| `sitemap.ts` | `sitemap.xml` route |
| `icon.png` | App icon (512×512, generated from brand mark) |
| `apple-icon.png` | Apple touch icon (180×180) |
| `api/health/route.ts` | Health probe (`GET`/`HEAD`) |

## `src/components/` — shared UI

| File | Purpose |
| --- | --- |
| `layout/SiteHeader.tsx` | Sticky nav, desktop dropdowns, mobile drawer, search/lang/CTA |
| `layout/SiteFooter.tsx` | Footer, link columns, newsletter form, social, legal bar |
| `layout/SearchDialog.tsx` | Command-palette style search (⌘K / Ctrl+K) |
| `layout/LanguageSwitcher.tsx` | 13-locale listbox with persistence |
| `layout/SkipLink.tsx` | Accessibility skip-to-content link |
| `providers/AppModals.tsx` | Global auth-modal + search orchestration, ⌘K binding |
| `ui/Button.tsx` | Button/link primitive (4 variants × 3 sizes) |
| `ui/Badge.tsx` | Chip, SeverityBadge, StatusDot, LiveBadge |
| `ui/Modal.tsx` | Accessible dialog (ESC, focus trap, scroll lock) |
| `ui/Field.tsx` | Labeled `Input` / `Textarea` with error + hint wiring |
| `ui/Toast.tsx` | Toast provider + `useToast()` |
| `ui/Reveal.tsx` | Scroll/mount reveal (CSS, always-visible fallback) |
| `ui/Counter.tsx` | Viewport-triggered animated counter |
| `ui/SectionHeading.tsx` | Section label + title + subtitle |
| `ui/Logo.tsx` | Brand logo image (full / mark) |
| `ui/Icon.tsx` | Curated Lucide icon registry by name |
| `ui/SocialIcons.tsx` | Inline brand SVG icons (LinkedIn, X, YouTube, GitHub) |

## `src/config/`

| File | Purpose |
| --- | --- |
| `nav.ts` | Primary navigation tree (with dropdown children) + search index |

## `src/data/`

| File | Purpose |
| --- | --- |
| `mock.ts` | Deterministic seeded mock dataset (threats, incidents, IOCs, assets, identities, compliance, risks, alerts, events, feeds, KPIs, timeseries, MITRE, integrations, reports) |
| `worldDots.ts` | Generated dot-matrix world map coordinates (from Natural Earth 110m land polygons) |

## `src/features/` — feature-scoped components

| Area | Files |
| --- | --- |
| `hero/` | `Hero.tsx`, `ThreatGlobe.tsx`, `LiveThreatPanel.tsx`, `HeroMetrics.tsx` |
| `capabilities/` | `Capabilities.tsx` |
| `threat-intelligence/` | `GlobalThreatMap.tsx`, `WorldThreatMap.tsx`, `TopThreatsPanel.tsx` |
| `compliance/` | `ComplianceSection.tsx`, `FrameworkTiles.tsx` |
| `ai-copilot/` | `CopilotPanel.tsx`, `engine.ts` |
| `dashboard/` | `DashboardPreview.tsx`, `tabs.tsx`, `parts.tsx`, `MitreHeatmap.tsx`, `ThreatActivityChart.tsx` |
| `trust/` | `TrustSection.tsx` |
| `architecture/` | `ArchitectureFlow.tsx` |
| `scale/` | `ScaleSection.tsx` |
| `cta/` | `FinalCta.tsx` |
| `auth/` | `AuthModal.tsx` |
| `forms/` | `schemas.ts` |

## `src/hooks/`

| File | Purpose |
| --- | --- |
| `useInView.ts` | IntersectionObserver hook |
| `useCountUp.ts` | rAF number animation |
| `useLiveFeed.ts` | Deterministic simulated live event feed + stat ticks |
| `useMotionPreference.ts` | Central motion gate (reduced motion + env override) |

## `src/i18n/`

| File | Purpose |
| --- | --- |
| `config.ts` | Locale list, metadata, direction, detection |
| `provider.tsx` | React context provider, `useI18n()`, persistence |
| `server.ts` | Server-side locale read from cookie |
| `types.ts` | `DeepPartial` dictionary type |
| `dictionaries/en.ts` | Canonical English dictionary (source of truth, 448 lines) |
| `dictionaries/{fr,ar,es,de,pt,it,nl,tr,zh,ja,ko,ru}.ts` | 12 additional locales |
| `dictionaries/index.ts` | Locale registry + deep-merge fallback |

## `src/lib/`

| File | Purpose |
| --- | --- |
| `utils.ts` | `cn()`, formatters, severity tokens/glyphs |

## `src/services/`

| File | Purpose |
| --- | --- |
| `repositories.ts` | Threat/Incident/IOC/Asset/Identity/Compliance/Risk/Alert/Event/Feed/Dashboard repositories + statistics service |

## `src/types/`

| File | Purpose |
| --- | --- |
| `domain.ts` | Typed domain models (Threat, Incident, IOC, Asset, Identity, ComplianceFramework, Control, Evidence, Risk, Alert, SecurityEvent, ThreatFeed, AIQuery, AIResponse, GeoThreatNode, DashboardKpi, TimeSeriesPoint, MitreCell, Integration, AutomationRun, Report) |

## `src/proxy.ts`

| File | Purpose |
| --- | --- |
| `proxy.ts` | Next.js 16 proxy (formerly middleware): detects `Accept-Language`, sets `dc.locale` cookie |

---

## Not present in the project

The following were inspected for and confirmed **absent**:

- Database schema, migrations, seed scripts
- Authentication backend / Auth.js configuration
- Test suites (unit / integration / E2E) and test runners
- CI/CD workflows (`.github/workflows/`)
- Prettier configuration
- Playwright / Cypress configuration
- Font files (fonts are loaded via `next/font/google` — see `FONTS.md`)
- Committed secrets, API keys or credentials
