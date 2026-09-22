# Reproducibility

Goal: any engineer can recreate the exact environment that produced the current
application.

## Required versions

| Item | Exact version | How it was determined |
| --- | --- | --- |
| Node.js | **22.23.2** | `node -v` on the build machine |
| npm | **10.9.8** | `npm -v` on the build machine |
| Lockfile | `package-lock.json`, `lockfileVersion: 3` | committed |
| Framework | Next.js 16.3.5 | `package.json` + lockfile |
| React | 19.2.8 | lockfile |

Node 22 is required: Next.js 16 requires Node ≥ 20.9, and this project was developed
and verified on Node 22.23.2. Node 22 LTS is the recommended target.

## Step-by-step environment recreation

### 1. Install Node 22

Using `nvm`:

```bash
nvm install 22.23.2
nvm use 22.23.2
node -v        # → v22.23.2
npm -v         # → 10.9.8
```

Or install Node 22 LTS from <https://nodejs.org/>. A `.nvmrc` is provided in
the repository root containing `22.23.2`.

### 2. Install dependencies from the lockfile

```bash
cd source
npm ci
```

`npm ci` installs exactly what `package-lock.json` pins and fails if
`package.json` and the lockfile disagree. **Do not use `npm install`** for a
reproducible environment — it may update the lockfile.

> If your registry differs (corporate mirror), set `npm config set registry <url>`
> before `npm ci`. All packages are public npm packages.

### 3. Platform-specific optional dependencies

The lockfile includes optional platform binaries for Tailwind's native engine
(`@tailwindcss/oxide-*`) and Next.js SWC. `npm ci` installs the correct binary for
the host platform automatically. If you move the extracted `node_modules` between
architectures, delete `node_modules` and re-run `npm ci`.

### 4. Environment variables

```bash
cp .env.example .env.local
```

The application runs with the defaults — **no secret is required**. `NEXT_PUBLIC_SITE_URL`
defaults to `http://localhost:5555` when unset.

### 5. Verify

```bash
npm run typecheck
npm run lint
npm run build
npm run start       # http://localhost:5555
curl http://localhost:5555/api/health
```

## Build output characteristics

- Next.js build output reports route `/` as dynamic (`ƒ`) because the root layout
  awaits `cookies()` for locale detection. This is expected.
- Build artifacts live in `.next/` (not shipped; rebuild from source).
- Approximate cold build time on the packaging machine: **~25 s**.

## Determinism notes

- **Data is deterministic.** `src/data/mock.ts` uses a seeded `mulberry32` PRNG and a
  fixed `BASE_TIME` constant. Re-rendering produces identical values; there is no
  `Math.random()` in any render path.
- **Time-dependent values.** "x ago" labels and the simulated live feed derive from
  the fixed `BASE_TIME` on first render and from `Date.now()` only inside
  `setInterval` callbacks after mount (client-only). This is intentional and
  hydration-safe.
- **Fonts** are fetched by `next/font/google` at build time and self-hosted by Next.
  A network connection is required during the **first build**; after that they are
  served from `.next/static`. See `FONTS.md`.

## Known environment caveats

- The project was packaged on macOS arm64. Windows/Linux users should run
  `npm ci` fresh (do not reuse a copied `node_modules`).
- Docker was **not executed** on the packaging machine (no Docker daemon available).
  The Dockerfile follows the standard multi-stage Next.js pattern; validate it in your
  environment before relying on it. See `DEPLOYMENT.md`.
