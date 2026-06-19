#!/usr/bin/env bash
# VPS deploy helper — run on the server after SSH login. See HOSTINGER.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Pulling latest main..."
git pull origin main

echo "==> Installing dependencies..."
npm ci

echo "==> Building frontend..."
npm run build

echo "==> Restarting PM2..."
if pm2 describe nocturne >/dev/null 2>&1; then
  pm2 restart ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi

pm2 save
echo "==> Done. Check: curl -s http://127.0.0.1:\${PORT:-3001}/api/health"
