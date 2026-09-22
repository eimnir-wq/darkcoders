# Dark Coders — Cybersecurity Operations Platform

> **Hunt In The Darkness!**

Production-grade marketing and platform-preview website for **Dark Coders**, a global
cybersecurity operations platform covering threat intelligence, SOC, SIEM, SOAR, GRC,
compliance, Zero Trust, IAM, AI security, incident response, sovereign infrastructure
and security research.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · Recharts · Zod · Lucide**.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5555
```

The application **always runs on port 5555** (`dev` and `start` scripts are pinned).

### Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Development server on port 5555          |
| `npm run build`     | Production build                         |
| `npm run start`     | Production server on port 5555           |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TS)    |
| `npm run typecheck` | TypeScript project check (`tsc --noEmit`)|

---

## Environment

Copy `.env.example` → `.env.local`. No secret is ever required to run the site —
every external integration falls back to a deterministic local mock service.

Key variables:

- `NEXT_PUBLIC_SITE_URL` — canonical URL used by metadata, sitemap and robots.
- `PORT` — defaults to `5555`.
- Optional: `DATABASE_URL`, `AUTH_*` (Keycloak/Entra/Okta), `SIEM_*`, `SOAR_*`,
  `THREAT_FEED_API_KEY`, `MINIO_*`, `AI_PROVIDER_*`, `RATE_LIMIT_*`.

---

## Docker

```bash
docker compose up --build
# → http://localhost:5555
```

- `Dockerfile` — multi-stage production image exposing `5555`.
- `docker-compose.yml` — service `web`, port `5555:5555`, healthcheck on `/api/health`.
- `docker-compose.yml` reads `.env` when present.

Health endpoint:

```bash
curl http://localhost:5555/api/health
# {"status":"ok","service":"dark-coders-web", ...}
```

---

## Architecture

```
src/
  app/                     App Router — layout, page, metadata, robots, sitemap, API
    api/health/route.ts    Health probe
  components/
    layout/                SiteHeader, SiteFooter, SearchDialog, LanguageSwitcher, SkipLink
    providers/             AppModals (auth + search orchestration)
    ui/                    Design-system primitives (Button, Badge, Modal, Field, Toast, …)
  config/                  Navigation + search index configuration
  data/                    Deterministic mock data + generated world dot-matrix map
  features/
    ai-copilot/            Security query engine + Copilot UI
    architecture/          Security pipeline flow
    auth/                  Login / trial / demo modal
    capabilities/          Core platform capability cards
    compliance/            Framework tiles + compliance section
    cta/                   Final call to action
    dashboard/             Interactive platform preview (11 tabs, charts, MITRE)
    forms/                 Zod validation schemas
    hero/                  Hero, rotating threat globe, live intelligence panel
    scale/                 Global scale section
    threat-intelligence/   World threat map + top-threats panel
    trust/                 Industry trust section
  hooks/                   useInView, useCountUp, useLiveFeed, useMotionPreference
  i18n/                    13 locales, RTL, persistence, provider, server helpers
  lib/                     Utilities (cn, formatters, severity tokens)
  services/                Repositories (Threat, Incident, Compliance, Asset, …)
  types/                   Typed domain models
  proxy.ts                 Locale detection + cookie (Next.js proxy convention)
```

### Data layer

The UI never hardcodes domain arrays. It consumes **repositories** in
`src/services/repositories.ts`, which read from a **deterministic** mock dataset in
`src/data/mock.ts` (seeded `mulberry32` PRNG + fixed reference instant → stable across
SSR, hydration and tests — never `Math.random()` in render paths).

Domain models in `src/types/domain.ts`: `Threat`, `Incident`, `IOC`, `Asset`,
`Identity`, `ComplianceFramework`, `Control`, `Evidence`, `Risk`, `Alert`,
`SecurityEvent`, `ThreatFeed`, `AIQuery`, plus dashboard/geo types.

### AI Security Copilot

`src/features/ai-copilot/engine.ts` implements a local query engine:

```
Copilot UI → Security Query Engine → Repositories (mock data) → Response Generator
```

Intents: threat summary, top risks, compliance status, incident report, identity
posture, asset posture, feed coverage, matched threat (ransomware/phishing/malware/
C2/DDoS/exploit/exfiltration/credential/cloud/insider), plus a grounded fallback.
Responses are generated in the active locale with graceful English fallback.

### Internationalization

- 13 locales: `en fr ar es de pt it nl tr zh ja ko ru`.
- No UI string is hardcoded in components — all copy resolves through dictionaries.
- Arabic is fully RTL (`dir="rtl"`, mirrored layout, Noto Sans Arabic).
- Language is persisted in `localStorage` **and** a cookie; the server reads the
  cookie in `proxy.ts` for first paint; browser language is auto-detected.
- Adding a language = add one dictionary file + one entry in `src/i18n/config.ts`.

### Design system

CSS custom properties (`--dc-*`) drive the brand: black `#050807`, dark graphite
surfaces, neon green `#00FF88` ramp, plus semantic security states
(critical/high/medium/low/info) used **only** for status — never as brand colour.
Reusable classes: `dc-card`, `dc-panel`, `dc-chip`, `dc-label`, `dc-grid-bg`,
`dc-text-glow`, `dc-hairline`.

### Accessibility

Skip link, semantic landmarks, ARIA roles for tabs/dialogs/listbox/switch/progress,
keyboard navigation (arrow keys for tabs, ESC to close overlays, focus trap in
modals), visible focus rings, `prefers-reduced-motion` support, severity conveyed by
glyph + text as well as colour.

### Motion

Framer Motion with a central `useMotionOK()` gate. When reduced motion is requested
(or `NEXT_PUBLIC_REDUCED_MOTION=1` is set for kiosk/low-power/QA deployments) all
scroll reveals render in their final state — content is never hidden.

### Security

- Zod validation on every form; no `dangerouslySetInnerHTML` for user input.
- Security headers + CSP in `next.config.ts` (nosniff, DENY framing, referrer policy,
  permissions policy, HSTS).
- No secrets in client code; all configuration via environment variables.
- API routes are `no-store`; health endpoint returns only non-sensitive data.

### SEO

Metadata + OpenGraph + Twitter cards, canonical URLs, `robots.txt`, `sitemap.xml`,
`Organization` JSON-LD, per-locale `hreflang` alternates.

---

## QA checklist

- [x] `npm run lint` clean
- [x] `npm run typecheck` clean
- [x] `npm run build` succeeds
- [x] `npm run start` serves http://localhost:5555
- [x] `/api/health` → `{"status":"ok"}`
- [x] No console errors (verified in headless Chrome, including interactions)
- [x] Desktop / tablet / mobile (390px) layouts, no horizontal overflow
- [x] RTL Arabic verified (`dir="rtl"`, `lang="ar"`)
- [x] Dashboard tabs, filters, charts, MITRE heatmap
- [x] Copilot quick actions + free-text queries
- [x] Search dialog, auth modal (validation + ESC), newsletter validation
- [x] Integration toggles, settings switches, language switching

## License

Proprietary — © 2024 DarkCoders. All rights reserved.
