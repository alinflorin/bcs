FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist /app/dist
EXPOSE 8080
CMD ["node", "/app/dist/index.js"]
