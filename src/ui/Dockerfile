FROM node:alpine AS builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/bcs-ui/browser /usr/share/nginx/html
EXPOSE 80
