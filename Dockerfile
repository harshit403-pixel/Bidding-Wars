FROM node:24-alpine AS client

WORKDIR /app/Client

COPY Client/package*.json ./
RUN npm ci

COPY Client/ ./
RUN npm run build


FROM node:24-alpine AS server

WORKDIR /app

COPY ./server/package*.json ./

RUN npm ci

COPY server/ ./

# Copy client build into server/public
COPY --from=client-builder /app/Client/dist ./public

RUN npm run build


FROM node:24-alpine

WORKDIR /app

COPY ./server/package*.json ./

RUN npm ci

COPY --from=server /app/dist ./

COPY --from=client /app/dist ./public

CMD ["node", "server.js"]