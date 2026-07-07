#!/usr/bin/env bash
# Build the frontend Docker image locally (linux/amd64), push to Docker Hub, pull on EC2.
#
# Usage:
#   ./scripts/deploy-frontend.sh                  # build + push + deploy (tag: latest)
#   ./scripts/deploy-frontend.sh --test-local     # build --load, test on :3000, push, deploy
#   ./scripts/deploy-frontend.sh --no-deploy        # build + push only
#   ./scripts/deploy-frontend.sh --skip-build       # push existing local image + deploy
#   ./scripts/deploy-frontend.sh --no-clean         # skip local Docker cleanup after deploy
#   ./scripts/deploy-frontend.sh --only-clean       # local Docker cleanup only (no build/deploy)
#
# Environment (set in .env.deploy or export):
#   DOCKER_USERNAME      Docker Hub user (default: anantastro)
#   DOCKER_TOKEN         Docker Hub PAT (required for push/pull)
#   DOCKER_REGISTRY      Image repo (default: anantastro/anantastro-frontend)
#   DOCKER_TAG           Image tag (default: latest)
#   DOCKER_IMAGE         Full ref override (default: ${DOCKER_REGISTRY}:${DOCKER_TAG})
#   SSH_KEY              Path to PEM key (default: /Users/leevesh/keys/anant.pem)
#   SSH_USER             SSH user (default: ubuntu)
#   SSH_HOST             Server IP/hostname (default: 18.215.189.57)
#   NEXT_PUBLIC_API_URL  Build arg; empty for nginx same-domain prod (default: "")
#   REMOTE_DIR           Remote deploy dir (default: /home/ubuntu)
#   LOCAL_PORT           Port for --test-local (default: 3000)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_DEPLOY_FILE="${ENV_DEPLOY_FILE:-$ROOT_DIR/.env.deploy}"
SSH_KEY="${SSH_KEY:-/Users/leevesh/keys/anant.pem}"
SSH_USER="${SSH_USER:-ubuntu}"
SSH_HOST="${SSH_HOST:-18.215.189.57}"
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-}"
REMOTE_DIR="${REMOTE_DIR:-/home/ubuntu}"
LOCAL_PORT="${LOCAL_PORT:-3000}"
BUILDER_NAME="${BUILDER_NAME:-anantastro}"

SSH_OPTS=(-i "$SSH_KEY" -o StrictHostKeyChecking=accept-new)

DO_TEST_LOCAL=false
DO_DEPLOY=true
DO_BUILD=true
DO_CLEAN=true
DO_ONLY_CLEAN=false

usage() {
  sed -n '2,20p' "$0" | sed 's/^# \?//'
  exit "${1:-0}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --test-local) DO_TEST_LOCAL=true; shift ;;
    --no-deploy) DO_DEPLOY=false; shift ;;
    --skip-build) DO_BUILD=false; shift ;;
    --no-clean) DO_CLEAN=false; shift ;;
    --only-clean) DO_ONLY_CLEAN=true; DO_BUILD=false; DO_DEPLOY=false; DO_CLEAN=true; shift ;;
    -h|--help) usage 0 ;;
    *) echo "Unknown option: $1" >&2; usage 1 ;;
  esac
done

log() { printf '==> %s\n' "$*"; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

load_deploy_env() {
  if [[ -f "$ENV_DEPLOY_FILE" ]]; then
    set -a
    # shellcheck source=/dev/null
    source "$ENV_DEPLOY_FILE"
    set +a
  fi

  DOCKER_USERNAME="${DOCKER_USERNAME:-anantastro}"
  DOCKER_REGISTRY="${DOCKER_REGISTRY:-anantastro/anantastro-frontend}"
  DOCKER_TAG="${DOCKER_TAG:-latest}"
  DOCKER_IMAGE="${DOCKER_IMAGE:-${DOCKER_REGISTRY}:${DOCKER_TAG}}"
}

ssh_cmd() {
  ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" "$@"
}

ensure_docker() {
  require_cmd docker
  docker info >/dev/null 2>&1 || die "Docker is not running. Start Docker Desktop."
}

ensure_buildx() {
  if ! docker buildx inspect "$BUILDER_NAME" >/dev/null 2>&1; then
    log "Creating buildx builder: $BUILDER_NAME"
    docker buildx create --name "$BUILDER_NAME" --use
  else
    docker buildx use "$BUILDER_NAME"
  fi
  docker buildx inspect --bootstrap >/dev/null
}

ensure_registry_login() {
  [[ -n "${DOCKER_TOKEN:-}" ]] || die "DOCKER_TOKEN not set. Add it to ${ENV_DEPLOY_FILE} or export it."
  log "Logging into Docker Hub as ${DOCKER_USERNAME}"
  printf '%s' "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin >/dev/null
}

ensure_remote_registry_login() {
  [[ -n "${DOCKER_TOKEN:-}" ]] || die "DOCKER_TOKEN not set. Add it to ${ENV_DEPLOY_FILE} or export it."
  log "Logging into Docker Hub on server as ${DOCKER_USERNAME}"
  printf '%s' "$DOCKER_TOKEN" | ssh_cmd "docker login -u ${DOCKER_USERNAME} --password-stdin" >/dev/null
}

build_image() {
  local output_flag="--push"
  if $DO_TEST_LOCAL || ! $DO_DEPLOY; then
    output_flag="--load"
  fi

  log "Building ${DOCKER_IMAGE} for linux/amd64 (NEXT_PUBLIC_API_URL='${NEXT_PUBLIC_API_URL}')"
  docker buildx build \
    --platform linux/amd64 \
    $output_flag \
    -t "$DOCKER_IMAGE" \
    --build-arg "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" \
    -f Dockerfile \
    .
  log "Build complete: ${DOCKER_IMAGE}"
}

push_image() {
  log "Pushing ${DOCKER_IMAGE}"
  docker push "$DOCKER_IMAGE"
  log "Push complete"
}

test_local() {
  log "Running local smoke test on http://localhost:${LOCAL_PORT} (Ctrl+C to stop and continue)"
  docker run --rm --platform linux/amd64 -p "${LOCAL_PORT}:3000" "$DOCKER_IMAGE" || true
}

clean_local() {
  log "Cleaning local Docker cache (buildx + dangling images)"
  docker buildx prune -f 2>/dev/null || true
  docker builder prune -f 2>/dev/null || true
  docker image rm "$DOCKER_IMAGE" 2>/dev/null || true
  docker image prune -f 2>/dev/null || true
  log "Local Docker after cleanup:"
  docker system df 2>/dev/null | head -5 || true
}

deploy_remote() {
  ensure_remote_registry_login

  log "Pulling ${DOCKER_IMAGE} on server and restarting frontend"
  ssh_cmd bash -s -- "$DOCKER_IMAGE" "$REMOTE_DIR" <<'REMOTE'
set -euo pipefail
DOCKER_IMAGE="$1"
REMOTE_DIR="$2"
cd "$REMOTE_DIR"

export FRONTEND_IMAGE="$DOCKER_IMAGE"

if ! grep -q "$DOCKER_IMAGE" docker-compose.yml 2>/dev/null; then
  echo "NOTE: using FRONTEND_IMAGE=${DOCKER_IMAGE} for this deploy"
fi

docker compose pull frontend
FRONTEND_IMAGE="$DOCKER_IMAGE" docker compose up -d frontend --no-build --force-recreate

sleep 5
docker compose ps frontend
docker compose logs frontend --tail 15
echo "Deploy complete."
REMOTE
}

main() {
  load_deploy_env
  ensure_docker

  if $DO_ONLY_CLEAN; then
    clean_local
    exit 0
  fi

  [[ -f "$SSH_KEY" ]] || die "SSH key not found: $SSH_KEY"
  [[ -f Dockerfile ]] || die "Run from app repo root (Dockerfile not found)"

  ensure_registry_login

  if $DO_BUILD; then
    ensure_buildx
    build_image
  else
    docker image inspect "$DOCKER_IMAGE" >/dev/null 2>&1 \
      || die "Image ${DOCKER_IMAGE} not found locally. Run without --skip-build first."
  fi

  if $DO_TEST_LOCAL; then
    test_local
  fi

  # Push when build used --load (test / no-deploy) or redeploying a local image
  if $DO_TEST_LOCAL || ! $DO_DEPLOY || ! $DO_BUILD; then
    push_image
  fi

  if $DO_DEPLOY; then
    deploy_remote
    log "Frontend deployed: https://test.anantastro.com"
  else
    log "Skipping server deploy (--no-deploy). Image pushed: ${DOCKER_IMAGE}"
  fi

  if $DO_CLEAN; then
    clean_local
  fi
}

main "$@"
