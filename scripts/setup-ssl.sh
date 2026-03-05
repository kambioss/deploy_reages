#!/usr/bin/env bash
# ================================================================
#  setup-ssl.sh
#  Génère les certificats SSL pour reaages.gis-master.com
#
#  Option A : Let's Encrypt (recommandé en prod)
#  Option B : Certificat auto-signé (dev / test)
# ================================================================
set -euo pipefail

DOMAIN="reaages.gis-master.com"
SSL_DIR="$(cd "$(dirname "$0")/.." && pwd)/ssl"
mkdir -p "$SSL_DIR"
chmod 700 "$SSL_DIR"

log()  { echo -e "\033[32m[✔]\033[0m $*"; }
info() { echo -e "\033[34m[i]\033[0m $*"; }
warn() { echo -e "\033[33m[!]\033[0m $*"; }
err()  { echo -e "\033[31m[✘]\033[0m $*"; exit 1; }

echo ""
echo "═══════════════════════════════════════════════"
echo "  REAAGES — Configuration SSL"
echo "  Domaine : $DOMAIN"
echo "═══════════════════════════════════════════════"
echo ""

MODE=${1:-"letsencrypt"}

# ── Option A : Let's Encrypt via Certbot ─────────────────────
if [[ "$MODE" == "letsencrypt" ]]; then
  info "Mode : Let's Encrypt (Certbot)"
  echo ""
  warn "⚠ Ports 80 et 443 doivent être ouverts et accessibles"
  warn "  (Certbot utilise le challenge HTTP-01)"
  echo ""

  # ── Vérification droits root ────────────────────────────────
  if [[ $EUID -ne 0 ]]; then
    warn "Certbot nécessite les droits root."
    info "Relance automatique avec sudo…"
    echo ""
    exec sudo bash "$0" "$@"
  fi

  command -v certbot >/dev/null 2>&1 || err "certbot non installé. Lancez : sudo apt install certbot"

  # ── Arrêt temporaire de nginx si actif ─────────────────────
  info "Arrêt temporaire de Nginx (libération port 80)…"
  docker compose -f "$(dirname "$0")/../docker-compose.yml" stop nginx 2>/dev/null || true
  sleep 2

  # ── Obtention du certificat ─────────────────────────────────
  certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@gis-master.com \
    -d "$DOMAIN"

  # ── Copie des certs dans ./ssl/ ─────────────────────────────
  CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
  cp "$CERT_PATH/fullchain.pem" "$SSL_DIR/tls.crt"
  cp "$CERT_PATH/privkey.pem"   "$SSL_DIR/tls.key"

  # Permissions lisibles par l'utilisateur courant (pour Docker)
  REAL_USER="${SUDO_USER:-$USER}"
  chown "$REAL_USER":"$REAL_USER" "$SSL_DIR/tls.crt" "$SSL_DIR/tls.key" 2>/dev/null || true

  log "Certificats Let's Encrypt copiés dans $SSL_DIR"

  # ── DH params ───────────────────────────────────────────────
  if [[ ! -f "$SSL_DIR/dhparam.pem" ]]; then
    info "Génération de dhparam.pem (2048 bits)…"
    openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048
    log "dhparam.pem généré"
  fi

  # ── Redémarrage Nginx ───────────────────────────────────────
  info "Redémarrage de Nginx…"
  docker compose -f "$(dirname "$0")/../docker-compose.yml" start nginx 2>/dev/null || \
    warn "Nginx non démarré — lancez './scripts/deploy.sh up' si c'est le premier déploiement"

  # ── Renouvellement automatique (cron) ───────────────────────
  DEPLOY_DIR="$(cd "$(dirname "$0")/.." && pwd)"
  RENEW_SCRIPT="/etc/cron.d/reaages-certbot-renew"
  cat > "$RENEW_SCRIPT" << CRON
# Renouvellement auto Let's Encrypt — REAAGES
# Tous les lundis à 3h du matin
0 3 * * 1 root certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${DEPLOY_DIR}/ssl/tls.crt && cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${DEPLOY_DIR}/ssl/tls.key && docker exec reaages_nginx nginx -s reload"
CRON
  chmod 644 "$RENEW_SCRIPT"
  log "Renouvellement auto configuré dans $RENEW_SCRIPT"

# ── Option B : Auto-signé (dev / test) ───────────────────────
elif [[ "$MODE" == "selfsigned" ]]; then
  warn "Mode : Certificat auto-signé (TEST UNIQUEMENT)"
  warn "Les navigateurs afficheront un avertissement de sécurité."
  echo ""

  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/tls.key" \
    -out    "$SSL_DIR/tls.crt" \
    -subj   "/C=TN/ST=Tunis/L=Tunis/O=REAAGES/CN=$DOMAIN" \
    -addext "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN"

  log "Certificat auto-signé généré (valide 365 jours)"

  if [[ ! -f "$SSL_DIR/dhparam.pem" ]]; then
    info "Génération de dhparam.pem (2048 bits)…"
    openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048
    log "dhparam.pem généré"
  fi

else
  err "Usage: $0 [letsencrypt|selfsigned]"
fi

chmod 600 "$SSL_DIR/tls.key"
chmod 644 "$SSL_DIR/tls.crt" "$SSL_DIR/dhparam.pem"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Certificats SSL prêts dans : $SSL_DIR"
echo "  🌐  https://$DOMAIN"
echo "═══════════════════════════════════════════════"
