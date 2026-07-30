# =========================
# Stage 1 - Build Client
# =========================
FROM node:20-alpine AS client-builder

WORKDIR /app/Client

COPY Client/package*.json ./
RUN npm ci

COPY Client/ ./
RUN npm run build


# =========================
# Stage 2 - Build Server
# =========================
FROM node:20-alpine AS server-builder

WORKDIR /app/server

COPY server/package*.json ./

ENV MONGOMS_SKIP_DOWNLOAD=true
RUN npm ci

COPY server/ ./

# Copy client build into server/public
COPY --from=client-builder /app/Client/dist ./public

RUN npm run build


# =========================
# Stage 3 - Production
# =========================
FROM node:20-alpine

WORKDIR /app/server

ENV NODE_ENV=production

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/public ./public

EXPOSE 5000

CMD ["node", "dist/server.js"]