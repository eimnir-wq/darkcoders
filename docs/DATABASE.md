# Database & Storage

## Status: NOT IMPLEMENTED

The project has **no database, no ORM, no migrations and no persistence layer**. All
data is generated in-process from a deterministic mock module.

| Item | Status |
| --- | --- |
| Database engine | None |
| ORM (Prisma/Drizzle) | None |
| Schema / models | None |
| Migrations | None |
| Seed scripts | None (the "seed" is `src/data/mock.ts`) |
| Storage buckets (S3/MinIO) | None (MinIO env vars reserved only) |
| Backup requirements | None |
| Connection strings | None (`DATABASE_URL` is an empty placeholder) |

## Where data actually lives

| Data | Location | Nature |
| --- | --- | --- |
| Threats, incidents, IOCs, assets, identities, compliance, risks, alerts, events, feeds, KPIs, reports, integrations | `src/data/mock.ts` | Deterministic generated, in-memory |
| World map geometry | `src/data/worldDots.ts` | Generated static table |
| UI copy | `src/i18n/dictionaries/*.ts` | Static |
| Navigation | `src/config/nav.ts` | Static |
| Brand assets | `public/brand/*.png` | Static files |

## Domain models (the would-be schema)

`src/types/domain.ts` defines the typed models that a future database would persist.
They are the recommended starting point for a Prisma schema:

| Type | Key fields | Likely table |
| --- | --- | --- |
| `Threat` | id, name, category, severity, count, trend, changePct, source, detectedAt, status | `threats` |
| `Incident` | id, title, severity, status, assignee, createdAt, updatedAt, affectedAssets, mitreTactic | `incidents` |
| `IOC` | id, type, value, severity, confidence, firstSeen, source, tags | `iocs` |
| `Asset` | id, name, type, environment, riskScore, owner, region, status | `assets` |
| `Identity` | id, name, email, role, department, mfaEnabled, privileged, riskScore, lastActive, status | `identities` |
| `ComplianceFramework` | id, name, shortName, coverage, controlsTotal, controlsImplemented, lastAssessment, status | `compliance_frameworks` |
| `Control` | id, framework, code, title, status | `controls` |
| `Evidence` | id, controlId, type, collectedAt, automated | `evidence` |
| `Risk` | id, title, severity, likelihood, impact, score, owner, trend, status | `risks` |
| `Alert` | id, title, severity, category, timestamp, status, source, description | `alerts` |
| `SecurityEvent` | id, title, category, severity, timestamp, status, sourceIp, region, lat, lon | `security_events` |
| `ThreatFeed` | id, name, provider, type, indicators, status, lastSync, reliability | `threat_feeds` |
| `AIQuery` / `AIResponse` | id, prompt, intent / queryId, headline, summary, bullets, recommendations, sources, confidence | `ai_queries` |
| `Integration` | id, name, category, connected, description | `integrations` |
| `AutomationRun` | id, playbook, status, startedAt, durationMs, trigger | `automation_runs` |
| `Report` | id, name, type, generatedAt, period, sizeKb | `reports` |

## Migration path (recommended, not implemented)

1. Add Prisma + `DATABASE_URL`; translate `src/types/domain.ts` into `schema.prisma`.
2. Seed from `src/data/mock.ts` (keep the seeded generator for demo tenants).
3. Convert `src/services/repositories.ts` methods to `async` Prisma queries.
4. Make consumers `await` (server components) or fetch via route handlers.
5. Add `evidence` storage to MinIO/S3 (`MINIO_*` env vars already reserved).

The repository layer is the deliberate seam for this migration; UI components do not
touch data directly and would not need to change shape.
