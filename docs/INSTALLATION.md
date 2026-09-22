# Installation

Step-by-step instructions to install and run Dark Coders on a fresh machine.

## Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| Node.js | **22.x** (verified on 22.23.2) | Next.js 16 requires ≥ 20.9; 22 LTS is the target |
| npm | 10.x (verified on 10.9.8) | Ships with Node 22 |
| Git | any recent version | To clone the repository |
| OS | macOS, Linux or Windows (WSL recommended) | No native build tools required |

No database, Docker, or external service is required to run the application.

## 1. Get the code

```bash
git clone https://github.com/eimnir-wq/darkcoders.git
cd darkcoders
```

## 2. Install the correct Node version

The repository pins the version in `.nvmrc`:

```bash
nvm install 22.23.2
nvm use            # reads .nvmrc
node -v            # → v22.23.2
npm -v             # → 10.9.8
```

Or install Node 22 LTS from <https://nodejs.org/>.

## 3. Install dependencies

```bash
npm ci
```

`npm ci` installs exactly what `package-lock.json` pins. Use it rather than
`npm install` for a reproducible environment.

> If you use a private registry mirror, configure it first:
> `npm config set registry <your-registry-url>`.

## 4. Configure environment variables

```bash
cp .env.example .env.local
```

**The application runs with the defaults — no secret is required.**
`NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:5555` when unset.

See [`DEVELOPMENT.md`](./DEVELOPMENT.md#environment-variables) for the full variable
reference. Never commit `.env.local`.

## 5. Run the development server

```bash
npm run dev
```

Open <http://localhost:5555>.

> The port is pinned to **5555**. Do not use 3000.

## 6. Verify the installation

```bash
curl http://localhost:5555/api/health
# → {"status":"ok","service":"dark-coders-web","version":"1.0.0",...}
```

## 7. Production build (optional)

```bash
npm run build
npm run start        # http://localhost:5555
```

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `npm ci` fails with lockfile mismatch | `package.json` and `package-lock.json` out of sync | Run `npm install` once, commit the updated lockfile, then `npm ci` |
| Port 5555 already in use | Another process bound to 5555 | `lsof -ti tcp:5555 \| xargs kill` (macOS/Linux) or change the port in `package.json` + `.env.local` |
| Fonts fail to download during build | Air-gapped network | Run the first build on a networked machine, or switch to `next/font/local` — see [`FONTS.md`](./FONTS.md) |
| Blank sections | JavaScript animation unavailable | Expected to self-heal (content is visible by default); check the browser console |
| Node version errors | Wrong Node major | `nvm use` (must be 22.x) |

## Next steps

- Local development workflow → [`DEVELOPMENT.md`](./DEVELOPMENT.md)
- Deployment → [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- Docker → [`DEPLOYMENT.md`](./DEPLOYMENT.md#option-b--docker)
