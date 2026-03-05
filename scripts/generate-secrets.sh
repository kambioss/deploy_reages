#!/usr/bin/env bash
# ================================================================
#  generate-secrets.sh
#  Génère tous les secrets Docker de façon sécurisée
#  À exécuter UNE SEULE FOIS sur le serveur de production
# ================================================================
set -euo pipefail

SECRETS_DIR="$(cd "$(dirname "$0")/.." && pwd)/secrets"
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

log() { echo -e "\033[32m[✔]\033[0m $*"; }
warn() { echo -e "\033[33m[!]\033[0m $*"; }

# Fonction : génère un mot de passe aléatoire fort
randpass() {
  openssl rand -base64 32 | tr -d '=+/' | head -c 32
}

echo ""
echo "═══════════════════════════════════════════════"
echo "  REAAGES — Génération des Secrets Docker"
echo "═══════════════════════════════════════════════"
echo ""

# ── PostgreSQL principal ──────────────────────────────────────
if [[ ! -f "$SECRETS_DIR/pg_db.txt" ]]; then
  echo -n "reaages"         > "$SECRETS_DIR/pg_db.txt"
  echo -n "reaages_user"    > "$SECRETS_DIR/pg_user.txt"
  echo -n "$(randpass)"     > "$SECRETS_DIR/pg_password.txt"
  log "Secrets PostgreSQL principal créés"
else
  warn "Secrets PostgreSQL déjà existants — ignorés"
fi

# ── PostgreSQL Keycloak ───────────────────────────────────────
if [[ ! -f "$SECRETS_DIR/kc_pg_db.txt" ]]; then
  echo -n "keycloak"        > "$SECRETS_DIR/kc_pg_db.txt"
  echo -n "keycloak_user"   > "$SECRETS_DIR/kc_pg_user.txt"
  echo -n "$(randpass)"     > "$SECRETS_DIR/kc_pg_password.txt"
  log "Secrets PostgreSQL Keycloak créés"
else
  warn "Secrets Keycloak DB déjà existants — ignorés"
fi

# ── Admin Keycloak ────────────────────────────────────────────
if [[ ! -f "$SECRETS_DIR/kc_admin_user.txt" ]]; then
  echo -n "kcadmin"         > "$SECRETS_DIR/kc_admin_user.txt"
  echo -n "$(randpass)"     > "$SECRETS_DIR/kc_admin_password.txt"
  log "Credentials admin Keycloak créés"
else
  warn "Admin Keycloak déjà existant — ignoré"
fi

# ── JWT Secret ────────────────────────────────────────────────
JWT_SECRET=$(openssl rand -hex 64)

# ── backend.env ──────────────────────────────────────────────
PG_USER=$(cat "$SECRETS_DIR/pg_user.txt")
PG_PASS=$(cat "$SECRETS_DIR/pg_password.txt")
PG_DB=$(cat "$SECRETS_DIR/pg_db.txt")

cat > "$SECRETS_DIR/backend.env" << EOF
DATABASE_URL=postgresql://${PG_USER}:${PG_PASS}@postgres:5432/${PG_DB}?schema=public
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://reaages.gis-master.com
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=reaages
KEYCLOAK_CLIENT_ID=reaages-backend
EOF
log "backend.env généré"

# ── frontend.env ─────────────────────────────────────────────
cat > "$SECRETS_DIR/frontend.env" << EOF
DATABASE_URL=postgresql://${PG_USER}:${PG_PASS}@postgres:5432/${PG_DB}?schema=public
JWT_SECRET=${JWT_SECRET}
NODE_ENV=production
PORT=3000
API_URL=http://backend:3001
NEXT_PUBLIC_APP_URL=https://reaages.gis-master.com
NEXT_PUBLIC_API_URL=https://reaages.gis-master.com/api
EOF
log "frontend.env généré"

# ── Permissions strictes ─────────────────────────────────────
chmod 600 "$SECRETS_DIR"/*.txt "$SECRETS_DIR"/*.env
log "Permissions 600 appliquées sur tous les secrets"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Secrets générés dans : $SECRETS_DIR"
echo ""
echo "  ⚠ NE JAMAIS committer ce dossier dans Git !"
echo "  → Vérifiez que 'secrets/' est dans .gitignore"
echo "═══════════════════════════════════════════════"
echo ""

# ── Affichage résumé (sans les valeurs sensibles) ─────────────
echo "Fichiers créés :"
ls -la "$SECRETS_DIR/"
