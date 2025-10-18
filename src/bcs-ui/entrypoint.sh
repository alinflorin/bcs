#!/bin/sh
set -e

# Generate runtime env file
envsubst < /caddy-runtime/env-config.js.template > /caddy-runtime/env-config.js

# Start Caddy
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
