#!/bin/sh
set -e

# Generate runtime env file
envsubst < /tmp/caddy-runtime/env-config.js.template > /tmp/caddy-runtime/env-config.js

# Start Caddy
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
