#!/usr/bin/env sh
set -eu

SERVICE="${SERVICE:-backend}"
ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

case "$SERVICE" in
  backend)
    cd "$ROOT_DIR/platform/backend"
    exec node server.js
    ;;
  sqli-auth)
    cd "$ROOT_DIR/vulnerable/sqli-auth"
    exec node server.js
    ;;
  xss-search)
    cd "$ROOT_DIR/vulnerable/xss-search"
    exec node server.js
    ;;
  *)
    echo "Unsupported SERVICE: $SERVICE" >&2
    echo "Use SERVICE=backend, SERVICE=sqli-auth, or SERVICE=xss-search." >&2
    exit 1
    ;;
esac
