# Architecture

## Overview

Dark Coders is a **single-route Next.js 16 App Router application** (marketing page +
interactive platform preview) with one API route. It is a client-heavy presentation
layer over a deterministic, in-process data layer. There is no database, no auth
backend and no external service dependency at runtime.

```
┌──────────────────────────────────────────────────────────────────┐
│  Next.js App Router (server components + client components)       │
│                                                                  │
│  app/layout.tsx  ── fonts, metadata, providers, header/footer     │
│  app/page.tsx    ── composes the section features                 │
│  app/api/health  ── GET/HEAD health probe                        │
│  app/robots.ts · app/sitemap.ts ── SEO routes                     │
└───────────────┬──────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────┐
│  Providers (client)                                              │
│  ToastProvider → I18nProvider → AppModalsProvider                 │
└───────────────┬──────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────┐
│  Feature components (src/features/*)                             │
│  hero · capabilities · threat-intelligence · compliance ·        │
│  ai-copilot · dashboard · trust · architecture · scale · cta     │
└───────────────┬──────────────────────────────────────────────────┘
                │  reads through
                ▼
┌──────────────────────────────────────────────────────────────────┐
│  Services (src/services/repositories.ts)                          │
│  ThreatRepository · IncidentRepository · ComplianceRepository …   │
└───────────────┬──────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────┐
│  Data (src/data/mock.ts)                                          │
│  Seeded deterministic dataset (mulberry32 + fixed BASE_TIME)      │
└──────────────────────────────────────────────────────────────────┘
```

## Layering rules (enforced by convention)

1. **Feature components never import raw data arrays.** They import repositories from
   `src/services/repositories.ts`.
2. **Repositories are the only modules that import `src/data/mock.ts`.**
   (Exception: `WorldThreatMap` imports the generated `worldDots` geo table, and the
   dashboard chart imports the timeseries directly for chart rendering — both are
   presentation datasets, documented in `DATA-SOURCES.md`.)
3. **No UI string is hardcoded.** All copy resolves through `src/i18n` dictionaries.
4. **No randomness in render paths.** Mock data is generated with a seeded PRNG and a
   fixed reference instant so server and client render identically (no hydration
   mismatch).
5. **Domain types live in `src/types/domain.ts`** and are shared by data, services and UI.

## Rendering model

| Layer | Mode | Notes |
| --- | --- | --- |
| `app/layout.tsx` | Server (async) | Reads locale cookie via `next/headers`, sets `<html lang dir>` |
| `app/page.tsx` | Server | Static composition; sections are client components |
| Section features | Client (`"use client"`) | Need i18n context, interactivity, charts |
| `app/api/health` | Server | `force-dynamic`, `no-store` |
| `app/robots.ts`, `app/sitemap.ts` | Server | Generated metadata routes |

Because the layout awaits `cookies()`, the home route is server-rendered on demand
(`ƒ` in the build output) rather than statically prerendered.

## Provider tree

```
<html lang dir>
  <body class="flex min-h-dvh flex-col">
    <ToastProvider>              // toasts, aria-live region
      <I18nProvider>             // locale, dict, t(), setLocale
        <AppModalsProvider>      // auth modal + search dialog, ⌘K binding
          <SkipLink />
          <SiteHeader />
          <main id="main" class="flex-1"> {page} </main>
          <SiteFooter />
```

Order matters: `AppModalsProvider` renders `AuthModal` and `SearchDialog`, both of
which consume `useI18n()` and `useToast()`.

## Internationalization flow

```
Request ──▶ src/proxy.ts
              ├─ reads dc.locale cookie
              └─ if missing: detect from Accept-Language → set cookie
                          │
app/layout.tsx ───────────┘ reads cookie (getServerLocale)
              └─ sets <html lang="…" dir="ltr|rtl"> and passes initialLocale
                          │
I18nProvider ─────────────┘
              ├─ state starts at server locale (hydration-safe)
              ├─ after mount: sync from localStorage → cookie → navigator
              ├─ writes localStorage + cookie on change
              └─ updates document.documentElement.lang / dir
                          │
useI18n() ────────────────┘ exposes { locale, dir, dict, t, setLocale }
```

## Motion architecture

- **Scroll / mount entrances** use `Reveal`, a CSS-keyframe + IntersectionObserver
  component. Content is **visible by default** and only gains the entrance animation
  once observed — so it can never be trapped at `opacity: 0` if animation is
  unavailable. `useMotionOK()` disables the effect for reduced-motion users and when
  `NEXT_PUBLIC_REDUCED_MOTION=1`.
- **Interactive transitions** (modal, toast, mobile drawer, dropdowns, copilot
  messages) use Framer Motion, where JS-driven animation adds real value.

This split was a deliberate reliability decision (documented in `HANDOVER.md`).

## State management

No global state library. State is local to components:

- `I18nProvider` — locale
- `AppModalsProvider` — which modal/dialog is open
- `DashboardPreview` — active tab, refresh key
- Tab components — local filters
- `useLiveFeed` / `useLiveStats` — simulated realtime data via `setInterval`
- `SettingsTab` — local preference toggles (motion class, alerts)

## Security architecture

- Security headers + CSP applied globally via `next.config.ts` `headers()`.
- No `dangerouslySetInnerHTML` for user input; the only inline script is static
  `Organization` JSON-LD.
- All forms validated client-side with Zod (`src/features/forms/schemas.ts`).
- No secrets in client code; configuration via `NEXT_PUBLIC_*` and server env vars.
- `proxy.ts` sets only a non-sensitive locale cookie (`sameSite=lax`, 1 year).

## Extension points (designed for, not implemented)

The codebase is structured so these can be added without restructuring:

- **Persistence**: repositories are the seam — swap mock data for Prisma/PostgreSQL.
- **Auth**: `AuthModal` is a UI shell; replace with Auth.js / Keycloak / Entra ID.
- **External AI**: `src/features/ai-copilot/engine.ts` is the single query engine —
  swap the local generator for a provider call.
- **SIEM/SOAR/OpenSearch/MinIO**: integrations are modelled in
  `DashboardRepository.integrations()` and listed in `.env.example`.
- **Rate limiting**: `RATE_LIMIT_*` env vars are reserved; add in a route handler.
