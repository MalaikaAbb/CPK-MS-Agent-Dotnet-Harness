#!/usr/bin/env bash
# Load the repo-root .env (if present) into the environment, then run the given command.
# Used by the root package.json scripts so every process (3 .NET agents + Next) gets the same keys.
# .NET reads them via builder.Configuration (env vars override user-secrets); Next uses env vars that
# are already set in preference to its .env files.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$ROOT/.env"
  set +a
fi
exec "$@"
