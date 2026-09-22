# Routes

The application is a single-route site with one API route and generated metadata
routes. Navigation between sections uses in-page anchors (`#id`).

## Page routes

### `/` — Home

| Field | Value |
| --- | --- |
| **Path** | `/` |
| **File** | `src/app/page.tsx` |
| **Purpose** | Marketing + interactive platform preview for Dark Coders |
| **Auth required** | No |
| **Data source** | `src/services/repositories.ts` (over `src/data/mock.ts`) |
| **Rendering** | Server component composing client feature sections (dynamic `ƒ` — layout awaits `cookies()`) |
| **Status** | Working |

Section anchors composed on the page, in order:

| Anchor | Section component | Purpose |
| --- | --- | --- |
| — | `features/hero/Hero.tsx` | Hero: headline, CTAs, threat globe, live intelligence panel |
| — | `features/hero/HeroMetrics.tsx` | Animated metric strip (250M+, 180+, 50+, <1s) |
| `#platform` | `features/capabilities/Capabilities.tsx` | Five core platform capability cards |
| `#visibility` | `features/threat-intelligence/GlobalThreatMap.tsx` | World threat map, legend, stats, top-threats panel |
| `#compliance` | `features/compliance/ComplianceSection.tsx` | Compliance heading + framework tiles |
| `#copilot` | `features/ai-copilot/CopilotPanel.tsx` | AI Security Copilot (rendered inside compliance section) |
| `#trust` | `features/trust/TrustSection.tsx` | Industry categories (illustrative placeholders) |
| `#architecture` | `features/architecture/ArchitectureFlow.tsx` | 7-stage security pipeline |
| `#dashboard` | `features/dashboard/DashboardPreview.tsx` | Interactive 11-tab operations console preview |
| `#scale` | `features/scale/ScaleSection.tsx` | Global scale + metrics |
| `#cta` | `features/cta/FinalCta.tsx` | Final call to action |

## API routes

| Path | File | Methods | Status |
| --- | --- | --- | --- |
| `/api/health` | `src/app/api/health/route.ts` | `GET`, `HEAD` | Working |

See `API.md` for the full contract.

## Generated metadata routes

| Path | File | Output |
| --- | --- | --- |
| `/robots.txt` | `src/app/robots.ts` | Robots policy + sitemap reference |
| `/sitemap.xml` | `src/app/sitemap.ts` | 8 URL entries (home + section anchors) |
| `/icon.png` | `src/app/icon.png` | 512×512 app icon |
| `/apple-icon.png` | `src/app/apple-icon.png` | 180×180 Apple touch icon |

## Error / loading routes

| Route | Status |
| --- | --- |
| `/_not-found` | Next.js default not-found page (no custom `not-found.tsx` in the project) |
| `loading.tsx` | Not present (no route-level loading UI needed for a single synchronous page) |
| `error.tsx` | Not present |
| `global-error.tsx` | Not present |

> Note: the application has no data-fetching routes, so route-level loading/error
> boundaries were not required. Component-level loading/empty/error states exist
> inside the dashboard tabs and copilot (see `COMPONENT-CATALOG.md`).

## Navigation anchors referenced by the header/footer

`#platform`, `#visibility`, `#compliance`, `#copilot`, `#trust`, `#architecture`,
`#dashboard`, `#scale`, `#cta`. All resolve to the anchors listed above.

## Responsive behaviour

Every section is responsive; the header switches to a mobile drawer below `lg`
(1024 px) and the dashboard tab bar becomes horizontally scrollable. See
`RESPONSIVE.md`.
