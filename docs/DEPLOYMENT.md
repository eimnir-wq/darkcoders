# Deployment

## Deployment assumptions

The application is a standard Next.js 16 Node server. It is **not** configured for
static export (`next export`) because the root layout reads a cookie for locale
detection, so a Node runtime is required.

| Assumption | Value |
| --- | --- |
| Runtime | Node.js 22.x |
| Port | **5555** (pinned in `package.json`; overridable via `PORT` in Docker) |
| Process manager | Any (systemd, PM2, Docker, Kubernetes) |
| Reverse proxy | Required for TLS (nginx, Caddy, Traefik, cloud LB) |
| Database | None |
| Persistent storage | None |
| Outbound network at runtime | None |

---

## Option A — Node process (simplest)

```bash
# on the server
git clone <repo> app && cd app        # or unzip the package
nvm use                              # reads .nvmrc → 22.23.2
npm ci
cp .env.example .env.production
# edit .env.production → set NEXT_PUBLIC_SITE_URL=https://your-domain
npm run build
NODE_ENV=production npm run start     # listens on 0.0.0.0:5555
```

Run it under systemd:

```ini
# /etc/systemd/system/darkcoders.service
[Unit]
Description=Dark Coders web
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/darkcoders
Environment=NODE_ENV=production
Environment=PORT=5555
Environment=NEXT_PUBLIC_SITE_URL=https://darkcoders.example.com
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
User=darkcoders

[Install]
WantedBy=multi-user.target
```

## Option B — Docker

```bash
docker build -t dark-coders-web:latest .
docker run -d --name dark-coders \
  -p 5555:5555 \
  -e NEXT_PUBLIC_SITE_URL=https://darkcoders.example.com \
  dark-coders-web:latest
```

Or with Compose:

```bash
cp .env.example .env        # compose reads .env
docker compose up --build -d
docker compose ps           # healthcheck should report healthy
```

> ⚠️ **Docker was NOT executed** during packaging — the packaging machine had no
> Docker daemon. The image definition follows the standard multi-stage Next.js pattern
> and installs dependencies with `npm ci`, builds with `npm run build`, and starts with
> `npx next start -p 5555`. **Validate the build in your environment before relying on
> it.** The only likely adjustment is if you want a smaller image (switch to
> `output: "standalone"` and copy `.next/standalone`).

## Reverse proxy (nginx example)

```nginx
server {
  listen 443 ssl http2;
  server_name darkcoders.example.com;

  ssl_certificate     /etc/letsencrypt/live/darkcoders.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/darkcoders.example.com/privkey.pem;

  location / {
    proxy_pass         http://127.0.0.1:5555;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Upgrade           $http_upgrade;
    proxy_set_header   Connection        "upgrade";
  }
}
```

- Terminate TLS here; the app already sends HSTS.
- Keep `X-Forwarded-Proto` so Next.js knows the request is HTTPS.
- WebSocket `Upgrade` headers matter for the dev server's HMR only; harmless in prod.

## DNS & SSL

1. Point an `A`/`AAAA` record at the host (or a `CNAME` at your LB/CDN).
2. Issue a certificate (Let's Encrypt via certbot, or your cloud provider).
3. Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin and rebuild (it is inlined at
   build time), so canonical URLs, `sitemap.xml`, `robots.txt` and OpenGraph tags are
   correct.

## Health checks

| Probe | Command |
| --- | --- |
| App | `curl -fsS http://127.0.0.1:5555/api/health` → `{"status":"ok", …}` |
| Docker | Built-in `HEALTHCHECK` (30s interval, 5s timeout, 3 retries) |
| Compose | `healthcheck` on the `web` service |

Configure your LB/K8s readiness+ liveness probes against `/api/health`.

## CDN / caching

- Static assets under `/_next/static/*` are content-hashed and immutable — safe to
  cache aggressively at the edge.
- `/api/health` returns `Cache-Control: no-store` — do not cache.
- The HTML document is server-rendered per request (locale cookie) — cache cautiously
  or use a CDN that varies on the `Cookie`/`Accept-Language` headers.

## Rollback

1. Keep the previous build directory or image tag (`dark-coders-web:<sha>`).
2. Roll back by restarting the previous image/tag or `git checkout <prev> && npm ci &&
   npm run build && restart`.
3. No database migrations to reverse — there is no database.

## Zero-downtime notes

- Single Node process: use a process manager that supports reload (PM2 `reload`,
  systemd `Restart=always` with a brief blip), or run two instances behind the proxy
  and switch.
- Because there is no shared state, you can run multiple replicas freely.

## Post-deploy checklist

- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] Home page returns 200 and renders (check the hero)
- [ ] `NEXT_PUBLIC_SITE_URL` matches the public origin (verify `sitemap.xml`)
- [ ] Language switcher works; Arabic switches to RTL
- [ ] Security headers present (`curl -I https://…` → CSP, HSTS, X-Frame-Options)
- [ ] TLS certificate valid and auto-renewing
