FROM node:24-alpine AS builder
ARG VERSION

WORKDIR /app
# Install brotli and gzip utilities
RUN apk add --no-cache brotli gzip
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN echo "export const version = '$VERSION';" > ./src/version.ts
RUN npm run build

# Precompress only compressible files
RUN find dist -type f \( \
    -iname '*.js' -o -iname '*.css' -o -iname '*.html' -o -iname '*.json' -o \
    -iname '*.svg' -o -iname '*.xml' -o -iname '*.txt' -o \
    -iname '*.ttf' -o -iname '*.otf' -o -iname '*.woff' \
\) | while read file; do \
    brotli -f --quality=11 --output="${file}.br" "$file" && \
    gzip -kf9 "$file"; \
done

FROM caddy:2-alpine
ENV CADDY_TELEMETRY=off
COPY --from=builder /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80