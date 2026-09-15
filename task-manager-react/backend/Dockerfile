# backend/Dockerfile

# ---------- Etapa 1: build (TypeScript -> JavaScript) ----------
FROM node:20-alpine AS build

WORKDIR /app

# Todas las dependencias (incluye dev: typescript y prisma)
COPY package*.json ./
RUN npm ci

COPY . .

# prisma.config.ts exige DATABASE_URL, pero `generate` no se conecta a la BD:
# basta con un valor de relleno solo para este paso.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx prisma generate

# Codigo de la app (usa tsconfig.json) y cliente generado de Prisma
# (tsconfig lo excluye, por eso se compila aparte).
RUN npx tsc -p tsconfig.json --outDir dist --rootDir src \
      --declaration false --declarationMap false --sourceMap false \
 && npx tsc --ignoreConfig src/generated/prisma/client.ts \
      --outDir dist/generated/prisma \
      --module nodenext --target es2022 --types node --skipLibCheck

# ---------- Etapa 2: runtime ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
