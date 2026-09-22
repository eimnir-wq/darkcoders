# Third-Party Integrations

## Currently active

**None.** The application has zero runtime third-party service dependencies. It runs
fully offline once dependencies are installed and the build is complete.

| Service | Status |
| --- | --- |
| Authentication provider | Not connected (UI shell only) |
| Analytics | Not connected |
| Maps / tiles | Not used (custom SVG from static geo data) |
| Email / newsletter provider | Not connected (form validates + toasts only) |
| Monitoring / error tracking | Not connected |
| Payments | Not applicable |
| AI provider | Not connected (local deterministic engine) |
| CDN | Not configured |
| Object storage | Not connected |

## External network calls at runtime

| Call | When | Notes |
| --- | --- | --- |
| `next/font/google` (Inter, JetBrains Mono, Noto Sans Arabic) | **Build time only** | Next.js downloads and self-hosts the fonts into `.next/static`. No runtime request to Google. |
| Social links in the footer | User click only | `target="_blank" rel="noopener noreferrer"` to linkedin.com / x.com / youtube.com / github.com |
| `/api/health` | Local | Same origin |

No SDKs, API keys, or webhooks are wired.

## Modelled but not connected

The dashboard "Integrations" tab renders a 12-item catalogue from
`DashboardRepository.integrations()` with working connect/disconnect **local state
only** (no network call). It documents the intended integration surface:

| Integration | Category |
| --- | --- |
| Splunk Enterprise Security | SIEM |
| Elastic / OpenSearch | SIEM |
| Cortex XSOAR | SOAR |
| AWS Security Hub | Cloud |
| Microsoft Azure Defender | Cloud |
| Okta | Identity |
| Microsoft Entra ID | Identity |
| CrowdStrike Falcon | Threat Intel |
| MISP | Threat Intel |
| Snowflake | Data |
| MinIO Object Storage | Data |
| Keycloak | Identity |

> These are shown as a capability catalogue, **not** as active connections.

## Reserved environment variables (not used yet)

`.env.example` documents the integration surface. All are empty by default.

| Variable | Intended service | Setup notes |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL (Prisma) | Standard libpq connection string |
| `AUTH_SECRET` | Auth.js | 32-byte random secret |
| `AUTH_KEYCLOAK_ISSUER` / `AUTH_KEYCLOAK_CLIENT_ID` / `AUTH_KEYCLOAK_CLIENT_SECRET` | Keycloak OIDC | Create a confidential client with the app's callback URL |
| `SIEM_OPENSEARCH_URL` / `SIEM_OPENSEARCH_API_KEY` | OpenSearch / Elastic | API key with read scope |
| `SOAR_WEBHOOK_URL` | SOAR automation | Inbound webhook endpoint |
| `THREAT_FEED_API_KEY` | Threat intel feed | Provider-issued key |
| `MINIO_ENDPOINT` / `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | MinIO / S3 evidence store | Bucket for evidence artifacts |
| `AI_PROVIDER_API_KEY` / `AI_PROVIDER_BASE_URL` | External LLM | Replace the local copilot engine |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` | Rate limiter | Applied at the edge or in a route handler |

## Adding a real integration

1. Add the SDK as a dependency (`npm ci` after editing `package.json`).
2. Read credentials from `process.env` **only on the server** (route handler / server
   component). Never import secrets into a client component.
3. Keep the repository signature stable — swap the implementation in
   `src/services/repositories.ts`.
4. Document the new variables in `.env.example` and this file.

## Production requirements

Because nothing is connected today, production requires only:

- A Node.js 22 host (or the provided Docker image)
- A reverse proxy / TLS terminator
- `NEXT_PUBLIC_SITE_URL` set to the public origin

See `DEPLOYMENT.md`.
