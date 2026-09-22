# Project Structure

Complete annotated layout of the repository.

```
darkcoders/
├── .dockerignore
├── .env.example              Environment template (placeholders only, no secrets)
├── .gitignore
├── .nvmrc                    Node version pin → 22.23.2
├── AGENTS.md                 Contributor / coding-agent conventions
├── CLAUDE.md                 Pointer to AGENTS.md
├── Dockerfile                Multi-stage production image (port 5555)
├── README.md                 Project overview and quick start
├── docker-compose.yml        Compose service (5555:5555) + healthcheck
├── eslint.config.mjs         ESLint flat config
├── next.config.ts            Next.js config: security headers, CSP, optimisation
├── package.json              Scripts + dependencies (port 5555 pinned)
├── package-lock.json         Exact dependency lockfile (npm v3)
├── postcss.config.mjs        Tailwind v4 PostCSS plugin
├── tsconfig.json             TypeScript config, "@/*" → "src/*"
│
├── docs/                     Engineering documentation (see docs/INDEX.md)
│   ├── INDEX.md              Documentation index
│   ├── ARCHITECTURE.md       System architecture and data flow
│   ├── INSTALLATION.md       Install and run on a fresh machine
│   ├── DEVELOPMENT.md        Local workflow, scripts, conventions
│   ├── DEPLOYMENT.md         Node + Docker deployment, reverse proxy
│   ├── SECURITY.md           Implemented security controls
│   ├── SECURITY-REVIEW.md    Secret scan results
│   ├── PROJECT-STRUCTURE.md  This file
│   ├── PROJECT-INVENTORY.md  File-by-file inventory
│   ├── TECHNOLOGY-STACK.md   Exact versions used
│   ├── REPRODUCIBILITY.md    Environment reproduction
│   ├── DESIGN-SYSTEM.md      Tokens, typography, components
│   ├── COMPONENT-CATALOG.md  Component reference
│   ├── VISUAL-REPRODUCTION.md Why the UI looks as it does
│   ├── RESPONSIVE.md         Breakpoints and responsive behaviour
│   ├── I18N.md               Localization and RTL
│   ├── ROUTES.md             Route inventory
│   ├── API.md                API contract
│   ├── DATA-SOURCES.md       Where data comes from
│   ├── DATABASE.md           Database status (none)
│   ├── INTEGRATIONS.md       Third-party services
│   ├── DEPENDENCIES.md       Dependency rationale
│   ├── FONTS.md              Fonts and licensing
│   ├── TESTING.md            Testing status + strategy
│   ├── CICD.md               CI/CD status + recommended pipeline
│   ├── GIT-STATE.md          Version-control state
│   ├── QA-REPORT.md          QA results
│   ├── TODO.md               Remaining work
│   ├── HANDOVER.md           Working / partial / not implemented
│   ├── screenshots/          Reference screenshots
│   │   ├── desktop/          (7) homepage, hero, nav, dashboard, copilot, search, modal
│   │   ├── tablet/           (3) homepage, hero, dashboard
│   │   └── mobile/           (4) homepage, hero, drawer, dashboard
│   └── verification/         Captured build / test / environment evidence
│
├── public/                   Static assets served at the site root
│   └── brand/
│       ├── darkcoders-logo.png   Full logo (green chevron + wordmark)
│       ├── darkcoders-mark.png   Chevron mark only
│       └── icon-32.png           32×32 favicon source
│
└── src/
    ├── app/                  Next.js App Router
    │   ├── layout.tsx        Root layout: fonts, metadata, providers, shell
    │   ├── page.tsx          Home page composition + Organization JSON-LD
    │   ├── globals.css       Design system (CSS variables + @theme + keyframes)
    │   ├── robots.ts         robots.txt route
    │   ├── sitemap.ts        sitemap.xml route
    │   ├── icon.png          App icon (512×512)
    │   ├── apple-icon.png    Apple touch icon (180×180)
    │   └── api/health/route.ts   Health probe (GET/HEAD)
    │
    ├── components/
    │   ├── layout/           SiteHeader, SiteFooter, SearchDialog,
    │   │                     LanguageSwitcher, SkipLink
    │   ├── providers/        AppModals (auth + search orchestration)
    │   └── ui/               Design-system primitives:
    │                         Button, Badge, Modal, Field, Toast, Reveal,
    │                         Counter, SectionHeading, Logo, Icon, SocialIcons
    │
    ├── config/
    │   └── nav.ts            Navigation tree + search index
    │
    ├── data/
    │   ├── mock.ts           Deterministic seeded mock dataset
    │   └── worldDots.ts      Generated dot-matrix world map geometry
    │
    ├── features/             Feature-scoped components
    │   ├── hero/             Hero, ThreatGlobe, LiveThreatPanel, HeroMetrics
    │   ├── capabilities/     Capabilities
    │   ├── threat-intelligence/  GlobalThreatMap, WorldThreatMap, TopThreatsPanel
    │   ├── compliance/       ComplianceSection, FrameworkTiles
    │   ├── ai-copilot/       CopilotPanel, engine.ts (query engine)
    │   ├── dashboard/        DashboardPreview, tabs, parts, MitreHeatmap,
    │   │                     ThreatActivityChart
    │   ├── trust/            TrustSection
    │   ├── architecture/     ArchitectureFlow
    │   ├── scale/            ScaleSection
    │   ├── cta/              FinalCta
    │   ├── auth/             AuthModal (login / trial / demo)
    │   └── forms/            schemas.ts (Zod validation)
    │
    ├── hooks/                useInView, useCountUp, useLiveFeed, useMotionPreference
    │
    ├── i18n/
    │   ├── config.ts         Locale list, metadata, direction, detection
    │   ├── provider.tsx      React context + useI18n()
    │   ├── server.ts         Server locale from cookie
    │   ├── types.ts          DeepPartial dictionary type
    │   └── dictionaries/     en (canonical) + 12 locales + registry
    │
    ├── lib/
    │   └── utils.ts          cn(), formatters, severity tokens
    │
    ├── services/
    │   └── repositories.ts   Repository layer over the mock data
    │
    ├── types/
    │   └── domain.ts         Typed domain models
    │
    └── proxy.ts              Locale detection + cookie (Next.js proxy convention)
```

## Architectural rules (enforced by convention)

1. **Components never import raw data arrays** — they use `src/services/repositories.ts`.
2. **Repositories are the only modules importing `src/data/mock.ts`** (plus the two
   presentation datasets noted in `DATA-SOURCES.md`).
3. **No UI string is hardcoded** — all copy resolves through `src/i18n`.
4. **No randomness in render paths** — seeded PRNG + fixed `BASE_TIME`.
5. **Domain types live in `src/types/domain.ts`** and are shared across layers.

## Where to make common changes

| I want to… | Edit |
| --- | --- |
| Change copy / add a language | `src/i18n/dictionaries/*`, `src/i18n/config.ts` |
| Change brand colours or tokens | `src/app/globals.css` |
| Add or reorder a page section | `src/app/page.tsx` (+ `src/features/...`) |
| Change navigation | `src/config/nav.ts` |
| Change mock data | `src/data/mock.ts` |
| Add a form | `src/features/forms/schemas.ts` + a component |
| Change the API | `src/app/api/*/route.ts` |
