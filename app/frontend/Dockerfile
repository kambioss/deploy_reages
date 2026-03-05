# ================================================================
#  Frontend — Next.js 15 (Bun + standalone output)
#  Multi-stage build pour image minimale
# ================================================================

# ── Stage 1 : Dépendances ─────────────────────────────────────
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ── Stage 2 : Build ───────────────────────────────────────────
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de build injectées depuis docker-compose
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1

# Génération Prisma + Build Next.js
RUN bunx prisma generate
RUN bun run build

# ── Stage 3 : Runner (image finale minimale) ──────────────────
FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Utilisateur non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copie depuis le build standalone
COPY --from=builder /app/public          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# DB SQLite (si utilisée en fallback)
RUN mkdir -p /app/db && chown nextjs:nodejs /app/db

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["bun", "server.js"]
