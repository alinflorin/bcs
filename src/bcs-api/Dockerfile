FROM node:25-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
ARG VERSION
COPY . .
RUN echo "export const version = '$VERSION';" > ./src/version.ts
RUN npm run build

FROM node:25-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist /app/dist
USER appuser
EXPOSE 8080
CMD ["node", "/app/dist/index.js"]
