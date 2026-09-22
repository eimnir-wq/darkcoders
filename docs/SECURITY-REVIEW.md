# Security Review — Secret Scan

Automated review performed on the packaged source before delivery. **No secrets were
found. No values are exposed in this document.**

## Scope

All files in the repository root (96 files), excluding `node_modules/` and `.next/`.

## Checks performed and results

| # | Check | Pattern | Result |
| --- | --- | --- | --- |
| A | Private key material | `BEGIN .*PRIVATE KEY` | **No matches** |
| B | Known key formats | `AKIA[0-9A-Z]{16}`, `sk-[A-Za-z0-9]{20,}`, `ghp_[A-Za-z0-9]{20,}`, `xox[baprs]-`, `AIza[0-9A-Za-z_-]{35}` | **No matches** |
| C | Secret assignments | `(API_?KEY\|SECRET\|PASSWORD\|TOKEN\|PRIVATE_KEY\|CLIENT_SECRET)\s*[:=]\s*["'][^"']{8,}` | **No matches** |
| D | Committed env files | `.env`, `.env.local`, `.env.production`, … | **None present** — only `.env.example` |
| E | `.env.example` values | any non-empty value | Only non-secret defaults: `NEXT_PUBLIC_SITE_URL`, `PORT`, `NODE_ENV`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS` |
| F | VCS/build artifacts | `.git/`, `node_modules/` in the archive | **Excluded** by packaging |
| G | Dependency audit | `npm audit` | **0 vulnerabilities** |

## False positives reviewed

The only matches for "password" in the codebase are form **field names and labels**,
which are not credentials:

| File | Line | Content | Verdict |
| --- | --- | --- | --- |
| `src/features/forms/schemas.ts` | 24, 33 | `password: z.string()…` (validation schema) | Safe |
| `src/features/auth/AuthModal.tsx` | 138, 154 | `name="password"` on `<Input type="password">` | Safe |

No other matches.

## Environment variables

`.env.example` documents 20 variables. **All integration variables are empty by
design** — the application runs entirely on local mock services and requires no secret
to start. The variables exist to describe the intended integration surface
(SIEM, SOAR, MinIO, Keycloak, AI provider, PostgreSQL).

| Variable | Sensitive? | Required to run? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No (public) | No (defaults to `http://localhost:5555`) |
| `PORT` | No | No (defaults to 5555) |
| `NODE_ENV` | No | No |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS` | No | No |
| `DATABASE_URL` | Yes | No (unused) |
| `AUTH_SECRET`, `AUTH_KEYCLOAK_*` | Yes | No (unused) |
| `SIEM_*`, `SOAR_*`, `THREAT_FEED_API_KEY` | Yes | No (unused) |
| `MINIO_*` | Yes | No (unused) |
| `AI_PROVIDER_*` | Yes | No (unused) |

**Action for the receiving team:** populate these only in your own `.env.local` /
secret manager. Never commit them. Rotate immediately if any value is ever pasted into
a tracked file.

## Things deliberately excluded from the package

- `.git/` directory (see `GIT-STATE.md`)
- `node_modules/`, `.next/`, `*.tsbuildinfo`
- Any local `.env*` files (none existed)
- OS/editor caches (`.DS_Store`, etc.)

## Residual risks

1. `'unsafe-inline'` in the CSP (Next.js hydration) — tighten with a nonce pipeline.
2. Forms validate client-side only — add server-side validation + rate limiting when a
   real endpoint exists.
3. `AuthModal` is not real authentication — do not treat it as a security boundary.

Full control classification: `SECURITY.md`.
