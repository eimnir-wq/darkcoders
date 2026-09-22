# CI/CD

## Status: NOT CONFIGURED

There is **no CI/CD configuration** in the project.

| Item | Status |
| --- | --- |
| `.github/workflows/` | ❌ absent |
| GitLab CI | ❌ absent |
| CircleCI / Travis / Jenkins | ❌ absent |
| Vercel / Netlify config | ❌ absent |
| Build badges | ❌ absent |
| Automated deployment | ❌ absent |

The only automation artifacts are the `Dockerfile`, `docker-compose.yml` and the
`package.json` scripts.

## Recommended pipeline

The project is a straightforward Next.js app; the pipeline below is what the existing
scripts already support.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push: { branches: [main] }
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc      # 22.23.2
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm audit --audit-level=high
      - run: npm run build

  docker:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t dark-coders-web:${{ github.sha }} .
      - run: |
          docker run -d --name dc -p 5555:5555 dark-coders-web:${{ github.sha }}
          for i in $(seq 1 30); do
            curl -fsS http://localhost:5555/api/health && break || sleep 2
          done
          curl -fsS http://localhost:5555/api/health
          docker rm -f dc
```

### Gates the repo already satisfies

| Gate | Command | Expected |
| --- | --- | --- |
| Install | `npm ci` | clean, lockfile-enforced |
| Lint | `npm run lint` | no output |
| Types | `npm run typecheck` | no output |
| Audit | `npm audit` | 0 vulnerabilities |
| Build | `npm run build` | success, `.next/` produced |
| Smoke | `curl /api/health` | `{"status":"ok", …}` |

### Deployment job (when a target exists)

Add a deploy step after `quality` that either:

- builds and pushes the Docker image to a registry and rolls it out, or
- runs `npm run build` on the target and restarts the Node process.

Environment/secrets needed by the pipeline: `NEXT_PUBLIC_SITE_URL` (public), plus any
future integration secrets from `.env.example`. No secrets are required today.

## Notes

- Cache `~/.npm` (or use `actions/setup-node` `cache: npm`) to speed up `npm ci`.
- Run the container healthcheck after deploy; the image already defines one.
- Add Dependabot/`npm audit` to catch supply-chain issues (see `SECURITY.md`).
