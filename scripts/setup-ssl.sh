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
  warn "⚠ Ports 80 et 443 doivent être temporairement ouverts"
  warn "  (Certbot utilise le challenge HTTP-01)"
  echo ""

  command -v certbot >/dev/null 2>&1 || err "certbot non installé. Installez-le : apt install certbot"

  # Arrêt temporaire de nginx si actif
  docker compose -f "$(dirname "$0")/../docker-compose.yml" stop nginx 2>/dev/null || true

  certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@gis-master.com \
    -d "$DOMAIN"

  # Copie des certs dans ./ssl/
  CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
  cp "$CERT_PATH/fullchain.pem" "$SSL_DIR/tls.crt"
  cp "$CERT_PATH/privkey.pem"   "$SSL_DIR/tls.key"
  log "Certificats Let's Encrypt copiés dans $SSL_DIR"

  # Génération DH params
  if [[ ! -f "$SSL_DIR/dhparam.pem" ]]; then
    info "Génération de dhparam.pem (2048 bits)…"
    openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048
    log "dhparam.pem généré"
  fi

  # Script de renouvellement automatique
  RENEW_SCRIPT="/etc/cron.d/reaages-certbot-renew"
  cat > "$RENEW_SCRIPT" << 'CRON'
# Renouvellement auto Let's Encrypt — REAAGES
0 3 * * 1 root certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/reaages.gis-master.com/fullchain.pem /opt/reaages-deploy/ssl/tls.crt && cp /etc/letsencrypt/live/reaages.gis-master.com/privkey.pem /opt/reaages-deploy/ssl/tls.key && docker exec reaages_nginx nginx -s reload"
CRON
  chmod 644 "$RENEW_SCRIPT"
  log "Renouvellement auto configuré dans $RENEW_SCRIPT"

# ── Option B : Auto-signé (dev / test) ───────────────────────
elif [[ "$MODE" == "selfsigned" ]]; then
  warn "Mode : Certificat auto-signé (TEST UNIQUEMENT)"
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
echo "═══════════════════════════════════════════════"
