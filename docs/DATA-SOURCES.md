# Data Sources

Every value the UI renders comes from one of four places. There is **no network
fetch, no database and no external API** at runtime.

| Class | Where | Notes |
| --- | --- | --- |
| **Mock / simulated** | `src/data/mock.ts` | Deterministic, seeded. The primary dataset. |
| **Generated geographic** | `src/data/worldDots.ts` | Derived from public-domain Natural Earth data at packaging time |
| **Static content** | `src/config/nav.ts`, `src/i18n/dictionaries/*` | Navigation tree, search index, all copy |
| **Brand assets** | `public/brand/*` | Logo PNGs extracted from the supplied brand PDF |
| **Real (runtime)** | `src/app/api/health/route.ts` | Process uptime/version — genuine, not mocked |

---

## 1. `src/data/mock.ts` — deterministic dataset (493 lines)

**Determinism contract.** The file exports:

- `mulberry32(seed)` — a 32-bit seeded PRNG.
- `BASE_TIME = Date.UTC(2026, 8, 22, 12, 0, 0)` — fixed reference instant.
- `minutesAgo(n)` — ISO timestamp offset from `BASE_TIME`.
- `pick`, `range` helpers.

There is **no `Math.random()`** anywhere in the data layer or render paths. This
guarantees identical output on server and client (no hydration mismatch) and stable
snapshots.

### Exported datasets

| Export | Type | Count | Consumed by |
| --- | --- | --- | --- |
| `threats` | `Threat[]` | 12 | `ThreatRepository`, dashboard |
| `topThreats` | `Threat[]` | 5 | `ThreatRepository.top()`, `TopThreatsPanel` |
| `incidents` | `Incident[]` | 8 | `IncidentRepository` |
| `iocs` | `IOC[]` | 20 | `IocRepository` |
| `assets` | `Asset[]` | 24 | `AssetRepository` |
| `identities` | `Identity[]` | 20 | `IdentityRepository` |
| `complianceFrameworks` | `ComplianceFramework[]` | 11 | `ComplianceRepository`, `FrameworkTiles` |
| `risks` | `Risk[]` | 8 | `RiskRepository` |
| `alerts` | `Alert[]` | 10 | `AlertRepository` |
| `securityEvents` | `SecurityEvent[]` | 14 | `EventRepository` |
| `geoThreatNodes` | `GeoThreatNode[]` | 24 | `WorldThreatMap`, `EventRepository.geoNodes()` |
| `threatFeeds` | `ThreatFeed[]` | 12 | `FeedRepository` |
| `dashboardKpis` | `DashboardKpi[]` | 4 | `DashboardRepository.kpis()` |
| `liveThreatActivity` | `TimeSeriesPoint[]` | 24 | `ThreatActivityChart` |
| `mitreHeatmap` | `MitreCell[]` | 48 (12 tactics × 4) | `MitreHeatmap` |
| `integrations` | `Integration[]` | 12 | `DashboardRepository.integrations()` |
| `automationRuns` | `AutomationRun[]` | 6 | `DashboardRepository.automation()` |
| `reports` | `Report[]` | 6 | `DashboardRepository.reports()` |
| `heroStats` | object | — | `LiveThreatPanel`, `GlobalThreatMap` |
| `scaleStats` | object | — | (available; scale section uses inline metrics) |

### Editing the mock data

Change values directly in `src/data/mock.ts`. Keep timestamps derived from
`minutesAgo()` and avoid `Math.random()` to preserve determinism. The data is
intentionally realistic (real MITRE tactic names, real framework names, plausible
threat families) but is **fictional** — no claim of real customer, incident or
certification data is made.

> Compliance note: the compliance section explicitly states the frameworks are
> *supported*, not that certification has been achieved
> (`compliance.disclaimer`).

---

## 2. `src/data/worldDots.ts` — generated world map geometry

A dot-matrix world map used by `WorldThreatMap`. Each entry encodes a 3° lon/lat grid
cell as `latIndex * 121 + lonIndex`, hex-encoded and comma-joined into one string;
`getWorldDots()` decodes it lazily and caches the result.

- **Count:** 2,323 land cells
- **Origin:** Natural Earth `ne_110m_land` polygons (public domain), rasterised and
  sampled at packaging time
- **Projection used at render:** equirectangular, `x=(lon+180)/360·W`,
  `y=(90−lat)/180·H`, viewBox `720×360`, Antarctica (`lat < −58`) filtered out
- **Regeneration:** re-run the same rasterisation/sampling if higher resolution is
  needed. The header comment in the file documents the encoding.

This is the only "generated" data file; it is committed so the app has no build-time
data dependency.

---

## 3. Static content

| Source | Content |
| --- | --- |
| `src/config/nav.ts` | `navItems` (6 primary items with dropdown children), `searchIndex` (15 entries) |
| `src/i18n/dictionaries/en.ts` | Canonical English copy — the single source of UI text |
| `src/i18n/dictionaries/*.ts` | 12 translated locales (partial dictionaries, deep-merged over English) |

The nav dropdown labels reuse existing capability/trust/footer dictionary keys rather
than duplicating strings.

---

## 4. Simulated live data

`src/hooks/useLiveFeed.ts` produces the "live" feel:

- `useLiveFeed(initialCount, intervalMs)` — starts with deterministic events built
  from `BASE_TIME`, then every `intervalMs` (default 4200 ms) prepends a new event
  generated from `mulberry32(seed + tick)` with `Date.now()` as its timestamp. This is
  client-only (runs in `setInterval` after mount), so SSR output stays stable.
- `useLiveStats(seed)` — increments the "Threats Blocked" figure by a seeded amount
  every 3 s.

Event titles are **keys** (`events.malware`, `events.login`, …) resolved through i18n,
so the feed is localized.

---

## 5. Runtime-real data

`/api/health` reports `process.uptime()` and `npm_package_version` — the only
genuinely dynamic values in the application.

---

## Data flow summary

```
src/data/mock.ts ──▶ src/services/repositories.ts ──▶ feature components
src/data/worldDots.ts ──────────────────────────────▶ WorldThreatMap
src/config/nav.ts ──────────────────────────────────▶ SiteHeader, SearchDialog
src/i18n/dictionaries/* ────────────────────────────▶ useI18n() everywhere
public/brand/* ─────────────────────────────────────▶ Logo
```
