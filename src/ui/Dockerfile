FROM node:alpine AS builder
ARG VERSION
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN echo "export const version = '$VERSION';" > ./src/version.ts
RUN npm run build
# Install brotli and gzip utilities
RUN apk add --no-cache brotli gzip

# Precompress only compressible files
RUN find dist -type f \( \
    -iname '*.js' -o -iname '*.css' -o -iname '*.html' -o -iname '*.json' -o \
    -iname '*.svg' -o -iname '*.xml' -o -iname '*.txt' -o \
    -iname '*.ttf' -o -iname '*.otf' -o -iname '*.woff' \
\) | while read file; do \
    brotli -f --quality=11 --output="${file}.br" "$file" && \
    gzip -kf9 "$file"; \
done

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/bcs-ui/browser /usr/share/nginx/html
EXPOSE 80
