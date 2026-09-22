# Security

Classification of the security controls actually present in the codebase. Nothing is
claimed that is not implemented.

**Legend:** ✅ IMPLEMENTED · 🟡 PARTIAL · ❌ NOT IMPLEMENTED

---

## ✅ Implemented

### Security headers & CSP

Source: `next.config.ts` → `headers()`, applied to `/(.*)`.

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'`; `script-src 'self' 'unsafe-inline'` (+ `'unsafe-eval'` **in dev only**); `style-src 'self' 'unsafe-inline'`; `img-src 'self' data: blob:`; `font-src 'self' data:`; `connect-src 'self'`; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`; `object-src 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `X-DNS-Prefetch-Control` | `on` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

`poweredByHeader: false` removes the `X-Powered-By` fingerprint.
`'unsafe-inline'` for scripts/styles is required by Next.js's hydration/inline-style
mechanism; it is the standard trade-off without a nonce pipeline.

### Input validation

- All four forms validate with **Zod** (`src/features/forms/schemas.ts`):
  `newsletterSchema`, `demoRequestSchema`, `trialSignupSchema`, `loginSchema`.
- Email format + length limits (254), string length caps, password policy
  (min 10, ≥1 uppercase, ≥1 digit).
- Validation runs before any side effect; errors map to field-level messages with
  `aria-invalid` and `role="alert"`.

### Output encoding

- React escapes all interpolated values by default.
- The **only** `dangerouslySetInnerHTML` usage is the static `Organization` JSON-LD
  object literal in `src/app/page.tsx` — no user input is involved.
- No `innerHTML`, `eval`, or `new Function` in application code.

### Cookie hygiene

- The single cookie (`dc.locale`) contains a locale code only — no PII, no session.
- Flags: `path=/`, `max-age=31536000`, `sameSite=lax`.
- `HttpOnly` is **not** set, deliberately: the value must be readable by client JS for
  the language switcher. It is non-sensitive.

### Secret handling

- No secrets in source, client bundles, or committed files (see `SECURITY-REVIEW.md`).
- All configuration is via environment variables; only `NEXT_PUBLIC_*` values reach the
  client, and the only one used is the public site URL.
- `.env*` is git-ignored (with `!.env.example` exception).

### API protection

- The single API route (`/api/health`) returns only non-sensitive process metadata,
  sets `Cache-Control: no-store`, and has no write capability or user input.

### Dependency hygiene

- `npm audit` reports **0 vulnerabilities** (see `docs/verification/build-result.txt`).
- Lockfile committed (`npm ci` for reproducible installs).

---

## 🟡 Partial

### Content Security Policy
Implemented but uses `'unsafe-inline'` for script/style (Next.js requirement without a
nonce/hash pipeline). Tightening would require a nonce middleware.

### Rate limiting
**Not implemented**, but reserved: `.env.example` declares `RATE_LIMIT_MAX` and
`RATE_LIMIT_WINDOW_MS`. There is currently no endpoint that needs it (the only API is a
read-only health probe).

### CSRF
No explicit CSRF tokens. There are no state-changing endpoints and no cookie-authenticated
mutations, so CSRF is not currently exploitable; add protection (e.g. SameSite=strict
cookies + tokens) when a write API or auth is introduced.

---

## ❌ Not implemented (by design — no backend)

| Control | Status | Note |
| --- | --- | --- |
| Authentication | Not implemented | `AuthModal` is a UI shell with client-side validation only; it does not authenticate |
| Authorization / RBAC | Not implemented | No protected resources |
| Sessions | Not implemented | No session store |
| Audit logging | Not implemented | No server-side audit trail |
| Server-side rate limiting | Not implemented | Reserved env vars only |
| Secret rotation / vault | Not implemented | No secrets exist |
| WAF / bot protection | Not implemented | Deployment-layer concern |
| Encryption at rest | Not implemented | No data store |

> The `/api/health` route is the only server-side logic; it is read-only and safe.

---

## Threat model (current state)

The application is a **static-content marketing site with client-side simulations**.
The realistic risks are:

1. **Supply-chain** — mitigated by a committed lockfile and `npm audit` clean.
2. **XSS** — mitigated by React escaping, CSP, and no user-input HTML injection.
3. **Clickjacking** — mitigated by `frame-ancestors 'none'` + `X-Frame-Options: DENY`.
4. **Information disclosure** — mitigated by `nosniff`, referrer policy, and no secrets.
5. **Form abuse** — client validation only; **add server-side validation + rate
   limiting** when a real submission endpoint is built.

## Recommendations before production

1. Add a nonce-based CSP (remove `'unsafe-inline'` for scripts).
2. Add server-side validation and rate limiting to any real form endpoint.
3. Add authentication (Auth.js / Keycloak) before exposing the dashboard preview as a
   real console.
4. Terminate TLS at the edge and keep HSTS preload enabled.
5. Add a `Permissions-Policy` review and a `Cross-Origin-Opener-Policy` /
   `Cross-Origin-Resource-Policy` header if third-party embeds are introduced.
6. Wire `npm audit` / Dependabot into CI (see `CICD.md`).
