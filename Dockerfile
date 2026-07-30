# Multi-stage Dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
WORKDIR /app/server
ENV MONGOMS_SKIP_DOWNLOAD=true
RUN npm ci

# Copy server source code
COPY server/ ./
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
WORKDIR /app/server

COPY --from=builder /app/server/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/server/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]