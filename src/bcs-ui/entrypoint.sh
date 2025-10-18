#!/bin/sh
set -e

# Inject environment vars into env-config.js
envsubst < /usr/share/caddy/env-config.js.template > /usr/share/caddy/env-config.js

# Start Caddy
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
