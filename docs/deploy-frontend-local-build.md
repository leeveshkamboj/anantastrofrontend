# Frontend: build locally, push to registry, pull on server

The production EC2 instance (`18.215.189.57`) has **2 vCPUs and ~1 GB RAM**. A Next.js Docker build there takes ~50 minutes. Build on your Mac, **push to a registry**, and **pull on the server**.

## Overview

```mermaid
flowchart LR
  A[Mac: docker buildx] --> B[Mac: docker push]
  B --> C[Docker Hub / GHCR]
  C --> D[EC2: docker pull]
  D --> E[EC2: compose up frontend]
```

| Step | Where | Time (typical) |
|------|-------|----------------|
| `docker buildx build --push` | Mac | 3–10 min |
| `docker compose pull` | EC2 | 30–90 sec |
| `docker compose up` | EC2 | ~30 sec |

---

## Prerequisites

### On your Mac

- [Docker Desktop](https://docs.docker.com/desktop/) installed and **running**
- App repo: `/Users/leevesh/Workspace/Anantastro/app`
- SSH key: `/Users/leevesh/keys/anant.pem`
- Registry account (Docker Hub recommended below)

Verify:

```bash
docker info
uname -m   # arm64 on Apple Silicon — builds must target linux/amd64 for EC2
```

### Registry setup (one-time)

#### Option A: Docker Hub (recommended)

1. Create a repo at https://hub.docker.com — e.g. `leeveshkamboj/anantastro-frontend`
2. Log in on your Mac:

```bash
docker login
```

3. Log in on the server:

```bash
ssh -i /Users/leevesh/keys/anant.pem ubuntu@18.215.189.57
docker login
exit
```

Default image name used by the deploy script:

```text
leeveshkamboj/anantastro-frontend:latest
```

#### Option B: GitHub Container Registry (GHCR)

```bash
# Mac — use a GitHub PAT with read:packages + write:packages
echo "$GITHUB_TOKEN" | docker login ghcr.io -u leeveshkamboj --password-stdin

# Server — PAT with read:packages only
ssh -i /Users/leevesh/keys/anant.pem ubuntu@18.215.189.57 \
  'echo "$GITHUB_TOKEN" | docker login ghcr.io -u leeveshkamboj --password-stdin'
```

Set when deploying:

```bash
DOCKER_IMAGE=ghcr.io/leeveshkamboj/anantastro-frontend:latest ./scripts/deploy-frontend.sh
```

### On the server (one-time)

Update `~/docker-compose.yml` — point the frontend service at the registry image and remove the slow on-server build:

```yaml
  frontend:
    image: leeveshkamboj/anantastro-frontend:latest
    container_name: anantastro-frontend
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-}
      NODE_ENV: production
    networks:
      - anantastro-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

Remove the `build:` block under `frontend` so Compose never rebuilds on EC2.

Verify:

```bash
ssh -i /Users/leevesh/keys/anant.pem ubuntu@18.215.189.57 \
  "grep -A2 'frontend:' ~/docker-compose.yml | head -5"
```

---

## Build-time API URL

`NEXT_PUBLIC_API_URL` is **baked into the Next.js bundle at build time**.

| Deploy target | `NEXT_PUBLIC_API_URL` |
|---------------|------------------------|
| Production (nginx on `test.anantastro.com` proxies `/api`) | **empty** `""` |
| Local container test against prod API | `https://test.anantastro.com` |
| Local dev (no Docker) | see `.env.development` |

Production nginx routes `/api` to the backend, so the frontend should use **relative URLs** (empty `NEXT_PUBLIC_API_URL`). Do **not** use `.env.production`'s `http://localhost:4000` for EC2 deploys.

---

## Step-by-step: manual deploy

All commands from the app repo unless noted.

### 1. Enable cross-platform builds (one-time)

```bash
cd /Users/leevesh/Workspace/Anantastro/app

docker buildx create --name anantastro --use 2>/dev/null || docker buildx use anantastro
docker buildx inspect --bootstrap
docker login   # if not already logged in
```

### 2. Build and push for EC2 (linux/amd64)

```bash
export DOCKER_IMAGE="leeveshkamboj/anantastro-frontend:latest"
export NEXT_PUBLIC_API_URL=""   # production: same-domain nginx proxy

docker buildx build \
  --platform linux/amd64 \
  --push \
  -t "$DOCKER_IMAGE" \
  --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \
  -f Dockerfile \
  .
```

### 3. Test locally before push (optional)

Build with `--load` instead of `--push`, run, then push:

```bash
docker buildx build \
  --platform linux/amd64 \
  --load \
  -t "$DOCKER_IMAGE" \
  --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \
  -f Dockerfile \
  .

docker run --rm --platform linux/amd64 -p 3000:3000 "$DOCKER_IMAGE"
# Ctrl+C when done, then:
docker push "$DOCKER_IMAGE"
```

### 4. Pull and restart on the server

```bash
ssh -i /Users/leevesh/keys/anant.pem ubuntu@18.215.189.57 <<'EOF'
set -euo pipefail
cd ~

docker compose pull frontend
docker compose up -d frontend --no-build --force-recreate

sleep 5
docker compose ps frontend
docker compose logs frontend --tail 20
EOF
```

### 5. Verify production

```bash
curl -sI https://test.anantastro.com | head -5
```

---

## Automated deploy

```bash
cd /Users/leevesh/Workspace/Anantastro/app

# Build, push, pull on server, restart
./scripts/deploy-frontend.sh

# Test locally first (build --load), then push + deploy
./scripts/deploy-frontend.sh --test-local

# Build and push only (no server restart)
./scripts/deploy-frontend.sh --no-deploy

# Push an already-built local image and deploy (skip rebuild)
./scripts/deploy-frontend.sh --skip-build

# Keep local build cache (skip post-deploy cleanup)
./scripts/deploy-frontend.sh --no-clean

# Local Docker cleanup only
./scripts/deploy-frontend.sh --only-clean
```

After a successful deploy, the script **automatically cleans local Docker cache** (~4–5 GB typical):
- buildx build cache
- local copy of the pushed image (if loaded)
- dangling images

Environment overrides:

| Variable | Default |
|----------|---------|
| `DOCKER_IMAGE` | `leeveshkamboj/anantastro-frontend:latest` |
| `SSH_KEY` | `/Users/leevesh/keys/anant.pem` |
| `SSH_USER` | `ubuntu` |
| `SSH_HOST` | `18.215.189.57` |
| `NEXT_PUBLIC_API_URL` | `""` (empty) |
| `REMOTE_DIR` | `/home/ubuntu` |

Example:

```bash
DOCKER_IMAGE=ghcr.io/leeveshkamboj/anantastro-frontend:v1.2.3 ./scripts/deploy-frontend.sh
```

---

## Troubleshooting

### `denied: requested access to the resource is denied`

Run `docker login` on your Mac (and on the server for private images).

### `exec format error` on the server

Image built for wrong architecture. Rebuild with `--platform linux/amd64`.

### Server pulls old image

```bash
ssh -i /Users/leevesh/keys/anant.pem ubuntu@18.215.189.57 \
  "docker compose pull frontend && docker compose up -d frontend --no-build --force-recreate"
```

Or push with a version tag instead of only `latest`:

```bash
DOCKER_IMAGE=leeveshkamboj/anantastro-frontend:$(git rev-parse --short HEAD) ./scripts/deploy-frontend.sh
```

### Frontend still rebuilding on server

Remove the `build:` block from `frontend` in `~/docker-compose.yml`. Only `image:` should remain.

### Build OOM on Mac

The Dockerfile sets `NEXT_BUILD_NODE_OPTIONS=--max-old-space-size=2048`. Increase Docker Desktop memory if needed (Settings → Resources).

### `docker: not running` on Mac

Start Docker Desktop before building.

### Local disk still full after deploy

Run manually:

```bash
docker buildx prune -f
docker builder prune -f
docker image prune -f
docker system df
```
