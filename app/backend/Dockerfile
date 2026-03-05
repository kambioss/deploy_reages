# ================================================================
#  Backend — Express / Node.js 18
#  Multi-stage build, utilisateur non-root
# ================================================================

# ── Stage 1 : Dépendances ─────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ── Stage 2 : Runner ──────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV PORT=3001

# Utilisateur non-root (déjà dans le Dockerfile d'origine, on garde)
RUN addgroup -g 1001 -S nodejs \
 && adduser  -S nodejs -u 1001 -G nodejs

# Copie deps de production uniquement
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Répertoires nécessaires
RUN mkdir -p uploads logs && chown -R nodejs:nodejs uploads logs

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "src/app.js"]
