# Component Catalog

Reusable components, grouped by layer. Props are listed as they are declared in code.
All UI primitives live in `src/components/ui/`; feature components in `src/features/`.

---

## Layout

### `SiteHeader` — `src/components/layout/SiteHeader.tsx` (350 lines)

Sticky primary navigation.

- **Props:** none
- **State:** `scrolled`, `drawerOpen`, `openSection`
- **Behaviour:** transparent → blurred on scroll (>12px); desktop dropdowns on
  `Platform / Solutions / Industries / Research / Company` (hover + click, `Escape`,
  outside-click); mobile drawer below `lg` with accordion + body scroll lock;
  search / language / login / trial actions
- **Sub-component:** `DesktopNavItem({ item })` — renders a link or a dropdown
- **Responsive:** full nav ≥1024px; hamburger <1024px; login ≥768px; trial ≥640px
- **A11y:** `aria-expanded`, `aria-haspopup`, `aria-label` on icon buttons,
  `role="dialog" aria-modal="true"` on the drawer

### `SiteFooter` — `src/components/layout/SiteFooter.tsx`

- **Props:** none
- **Behaviour:** logo + tagline + description, 3 link columns + newsletter form
  (Zod-validated), social icons, legal bar
- **States:** newsletter error (`#newsletter-error`, `role="alert"`), success toast

### `SearchDialog` — `src/components/layout/SearchDialog.tsx`

- **Props:** `{ open: boolean; onClose: () => void }`
- **Behaviour:** filters `searchIndex` + compliance frameworks by query; keyboard
  `↑/↓/Enter/Escape`; result count; "no results" empty state; focus on open
- **Remounted via `key`** when opened so query state resets

### `LanguageSwitcher` — `src/components/layout/LanguageSwitcher.tsx`

- **Props:** `{ compact?: boolean }`
- **Behaviour:** `role="listbox"` with 13 locales; check mark on active; outside-click
  + `Escape` close; persists via `setLocale`

### `SkipLink` — `src/components/layout/SkipLink.tsx`

- **Props:** none — visually hidden until focused, jumps to `#main`

### `AppModalsProvider` — `src/components/providers/AppModals.tsx`

- **Props:** `{ children }`; exports `useAppModals()` → `{ openAuth, openSearch }`
- **Behaviour:** hosts `AuthModal` + `SearchDialog`; global `⌘K`/`Ctrl+K` binding

---

## UI primitives

### `Button` — `src/components/ui/Button.tsx`

- **Props:** `variant?: "primary"|"secondary"|"ghost"|"danger"`, `size?: "sm"|"md"|"lg"`,
  `href?`, `target?`, `rel?`, plus native button attributes
- **Renders:** `<button>`, internal `<Link>`, or external `<a rel="noopener noreferrer">`
- **States:** hover glow, active translate, `disabled:opacity-50`, focus-visible ring

### `Badge` — `src/components/ui/Badge.tsx`

- `Chip({ children, className, icon })`
- `SeverityBadge({ severity, label, className })`
- `StatusDot({ severity, pulse? })`
- `LiveBadge({ label })`

### `Modal` — `src/components/ui/Modal.tsx`

- **Props:** `{ open, onClose, title, description?, children, className?, closeLabel? }`
- **Behaviour:** focus trap, initial focus, focus restore, `Escape`, backdrop click,
  body scroll lock, Framer Motion entrance (disabled under reduced motion)
- **A11y:** `role="dialog" aria-modal="true" aria-label={title}`

### `Field` / `Input` / `Textarea` — `src/components/ui/Field.tsx`

- `Field({ label, error?, hint?, children })` — render-prop gives
  `{ id, describedBy, invalid }`
- `Input` / `Textarea` accept native props + `invalid?: boolean`

### `Toast` — `src/components/ui/Toast.tsx`

- `ToastProvider({ children })`, `useToast()` → `{ toast(message, kind?) }`
- Kinds: `success | info | error`; auto-dismiss 3.8s; `aria-live="polite"`

### `Reveal` — `src/components/ui/Reveal.tsx`

- **Props:** `{ children, delay?, y?, className?, style? }`
- **Behaviour:** visible by default; IntersectionObserver adds `data-reveal="in"` →
  CSS `dc-reveal-in`; disabled under reduced motion / `NEXT_PUBLIC_REDUCED_MOTION=1`

### `Counter` — `src/components/ui/Counter.tsx`

- **Props:** `{ end, decimals?, prefix?, suffix?, className? }`
- **Behaviour:** `useInView` + `useCountUp`; animates once when ≥40% visible;
  `dir="ltr"` so numerals render correctly in RTL

### `SectionHeading` — `src/components/ui/SectionHeading.tsx`

- **Props:** `{ label?, title, subtitle?, align?, className?, children? }`

### `Logo` — `src/components/ui/Logo.tsx`

- **Props:** `{ variant?: "full"|"mark", className?, priority?, height? }`
- **Behaviour:** `next/image` with intrinsic ratio; full logo 2134:308

### `Icon` / `SocialIcons` — `src/components/ui/Icon.tsx`, `SocialIcons.tsx`

- `DynamicIcon({ name, className })` — registry of ~24 Lucide icons
- Inline brand SVGs: `LinkedInIcon`, `XIcon`, `YouTubeIcon`, `GitHubIcon`,
  `socialLinks[]` (Lucide v1 removed brand icons, hence custom SVGs)

---

## Feature components

### Hero — `src/features/hero/`

| Component | Props | Notes |
| --- | --- | --- |
| `Hero` | — | Headline, CTAs, checkpoints, sector row, globe + live panel |
| `ThreatGlobe` | `{ className? }` | Custom SVG orthographic dot globe; rAF rotation ~30fps; static when motion off; pauses on tab hidden |
| `LiveThreatPanel` | — | 3 stats + realtime activity list; `useLiveFeed` + `useLiveStats` |
| `HeroMetrics` | — | 4 `Counter`s in a divided grid |

### `Capabilities` — `src/features/capabilities/Capabilities.tsx`

- 5 cards: icon, title, description, 4-item feature list, "Learn more"; hover glow;
  whole card is a focusable anchor

### Threat intelligence — `src/features/threat-intelligence/`

| Component | Props | Notes |
| --- | --- | --- |
| `GlobalThreatMap` | — | Section shell; owns `selected` node state; legend + stats + callout |
| `WorldThreatMap` | `{ selectedId, onSelect }` | Dot-matrix world + pulsing nodes + animated arcs; nodes are keyboard-focusable `role="button"` with `aria-label` and `<title>` |
| `TopThreatsPanel` | `{ onViewMap }` | Top 5 threats with severity/count/trend + CTA |

### Compliance — `src/features/compliance/`

| Component | Notes |
| --- | --- |
| `ComplianceSection` | Heading + explore CTA + `FrameworkTiles` + disclaimer + sticky `CopilotPanel` |
| `FrameworkTiles` | 11 framework cards with coverage `progressbar` and status pill |

### AI Copilot — `src/features/ai-copilot/`

| Component | Props | Notes |
| --- | --- | --- |
| `CopilotPanel` | `{ compact?: boolean }` | Chat UI: greeting, messages, quick actions, input; "thinking" indicator; sources + confidence; `aria-label`s |
| `engine.ts` | — | `answerSecurityQuery(prompt, locale): AIResponse`; `classify()` intent detection across 13 languages |

### Dashboard — `src/features/dashboard/`

| Component | Props | Notes |
| --- | --- | --- |
| `DashboardPreview` | — | Tab shell (11 tabs), KPI row, refresh, JSON export; ARIA `tablist` with arrow/Home/End keys |
| `OverviewTab` | — | Chart + recent threats + MITRE + AI SOC analyst card |
| `ThreatsTab` | — | Severity filter chips + table |
| `IncidentsTab` | — | Status filter + table |
| `IntelligenceTab` | — | Feeds table + IOC list |
| `ComplianceTab` | — | Framework coverage bars |
| `AssetsTab` | — | Type filter + table |
| `IdentitiesTab` | — | All/privileged/no-MFA filter + table |
| `ReportsTab` | — | Download buttons (Blob → file) |
| `AutomationTab` | — | Run list with status |
| `IntegrationsTab` | — | 12 connect/disconnect toggles (`aria-pressed`) |
| `SettingsTab` | — | Language select, reduce-motion switch, alerts switch |
| `MitreHeatmap` | — | 12×4 tactic/technique heat table |
| `ThreatActivityChart` | — | Recharts `AreaChart`, `isAnimationActive={false}`, dynamic `ssr:false` |
| `parts.tsx` | — | `Panel`, `Sparkline`, `SeverityPill`, `FilterChips`, `EmptyState`, `DataTable` |

### Others

| Component | Notes |
| --- | --- |
| `TrustSection` | 6 industry category cards + illustrative-placeholder note |
| `ArchitectureFlow` | 7-stage pipeline with connector chevrons |
| `ScaleSection` | Cinematic background + 4 counters + quote + tagline |
| `FinalCta` | Neon green card, primary/secondary CTAs |
| `AuthModal` | `{ mode: "login"\|"trial"\|"demo" \| null, onClose, onSwitchMode }`; Zod validation per mode; field errors; success toast |
| `schemas.ts` | `newsletterSchema`, `demoRequestSchema`, `trialSignupSchema`, `loginSchema` |

---

## Hooks

| Hook | Signature | Purpose |
| --- | --- | --- |
| `useInView` | `<T>(options?) → { ref, inView }` | IntersectionObserver; `inView` starts true if unsupported |
| `useCountUp` | `({ end, duration?, decimals?, start? }) → { value, display, run }` | rAF counter, honours reduced motion |
| `useLiveFeed` | `(initialCount?, intervalMs?) → { events, pulse }` | Deterministic simulated events |
| `useLiveStats` | `(seed?) → number` | Incrementing "threats blocked" offset |
| `useMotionOK` | `() → boolean` | Central motion gate |
| `useI18n` | `() → { locale, dir, dict, t, setLocale }` | i18n context accessor |
| `useToast` | `() → { toast }` | Toast accessor |
| `useAppModals` | `() → { openAuth, openSearch }` | Modal orchestration |
