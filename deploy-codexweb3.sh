#!/usr/bin/env bash

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
  printf "%b[INFO]%b %s\n" "$GREEN" "$NC" "$1"
}

print_warn() {
  printf "%b[WARN]%b %s\n" "$YELLOW" "$NC" "$1"
}

print_error() {
  printf "%b[ERROR]%b %s\n" "$RED" "$NC" "$1"
}

SSH_TARGET="${SSH_TARGET:-codex-web3}"
REMOTE_BASE="${REMOTE_BASE:-/home/forge/codexauth.web3connected.com}"
REMOTE_PATH="${REMOTE_BASE}/current"
COMPOSE_FILE="docker-compose.prod.yml"

print_info "CodexAuth API deployment starting"
print_info "SSH target: ${SSH_TARGET}"
print_info "Remote path: ${REMOTE_PATH}"

if [[ ! -f "Dockerfile" ]]; then
  print_error "Run this script from Docker/codexauth_api"
  exit 1
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  print_error "Missing ${COMPOSE_FILE}"
  exit 1
fi

print_info "Creating remote deployment directory"
ssh "${SSH_TARGET}" "mkdir -p '${REMOTE_PATH}'"

print_info "Syncing CodexAuth API files"
rsync -az --delete \
  --exclude '.git/' \
  --exclude 'vendor/' \
  --exclude 'node_modules/' \
  --exclude 'storage/logs/' \
  --exclude 'storage/framework/cache/' \
  --exclude 'storage/framework/sessions/' \
  --exclude 'storage/framework/views/' \
  --exclude '.env' \
  ./ "${SSH_TARGET}:${REMOTE_PATH}/"

print_info "Copying .env to server"
scp .env "${SSH_TARGET}:${REMOTE_PATH}/.env"

print_info "Starting CodexAuth API container"
ssh "${SSH_TARGET}" <<EOF
set -euo pipefail
cd "${REMOTE_PATH}"

docker compose -f "${COMPOSE_FILE}" build codexauth-api
docker compose -f "${COMPOSE_FILE}" up -d codexauth-api

echo
echo "--- CONTAINER STATUS ---"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAME|codexauth"

echo
echo "--- HEALTH CHECK (waiting 15s for startup) ---"
sleep 15
curl -sf http://127.0.0.1:8083/api/health | head -c 200 || echo "[WARN] Health check not yet ready"
EOF

print_info "CodexAuth API deployment finished"
print_warn "Nginx already configured at codexauth.web3connected.com (port 8083)"
