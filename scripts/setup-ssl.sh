#!/usr/bin/env bash
# ================================================================
#  setup-ssl.sh — Certificats SSL pour reaages.gis-master.com
#  Plugin OVH DNS-01 → 100% automatique, aucun port touché
# ================================================================
set -euo pipefail

DOMAIN="reaages.gis-master.com"
SSL_DIR="$(cd "$(dirname "$0")/.." && pwd)/ssl"
OVH_CREDS="$(cd "$(dirname "$0")/.." && pwd)/secrets/ovh.ini"
mkdir -p "$SSL_DIR"
chmod 700 "$SSL_DIR"

log()  { echo -e "\033[32m[✔]\033[0m $*"; }
info() { echo -e "\033[34m[i]\033[0m $*"; }
warn() { echo -e "\033[33m[!]\033[0m $*"; }
err()  { echo -e "\033[31m[✘]\033[0m $*"; exit 1; }

echo ""
echo "═══════════════════════════════════════════════"
echo "  REAAGES — Configuration SSL via OVH DNS"
echo "  Domaine : $DOMAIN"
echo "═══════════════════════════════════════════════"
echo ""

MODE=${1:-"letsencrypt"}

# ── Option A : Let's Encrypt + plugin OVH ────────────────────
if [[ "$MODE" == "letsencrypt" ]]; then
  info "Mode : Let's Encrypt — plugin OVH (DNS-01 automatique)"
  info "Aucun port à libérer, aucun service arrêté."
  echo ""

  # Escalade root
  if [[ $EUID -ne 0 ]]; then
    warn "Certbot nécessite les droits root."
    info "Relance automatique avec sudo…"
    echo ""
    exec sudo bash "$0" "$@"
  fi

  # ── Installation des outils ──────────────────────────────────
  info "Vérification des dépendances…"
  apt-get update -qq
  apt-get install -y -qq certbot python3-certbot-dns-ovh
  log "certbot + plugin OVH installés"

  # ── Vérification fichier credentials OVH ────────────────────
  if [[ ! -f "$OVH_CREDS" ]]; then
    echo ""
    warn "Fichier de credentials OVH manquant : secrets/ovh.ini"
    echo ""
    info "Créez vos credentials OVH API ici :"
    echo "  https://www.ovh.com/auth/api/createToken"
    echo ""
    echo "  Application name    : reaages-certbot"
    echo "  Application descr.  : Certbot SSL renouvellement"
    echo "  Validity            : Unlimited"
    echo "  Rights GET/PUT/POST/DELETE sur : /domain/zone/*"
    echo ""
    info "Puis créez le fichier secrets/ovh.ini avec :"
    echo ""
    cat << 'TEMPLATE'
  dns_ovh_endpoint           = ovh-eu
  dns_ovh_application_key    = VOTRE_APP_KEY
  dns_ovh_application_secret = VOTRE_APP_SECRET
  dns_ovh_consumer_key       = VOTRE_CONSUMER_KEY
TEMPLATE
    echo ""
    echo "  chmod 600 secrets/ovh.ini"
    echo ""
    err "Créez secrets/ovh.ini puis relancez le script."
  fi

  chmod 600 "$OVH_CREDS"
  log "Credentials OVH trouvés"

  # ── Obtention du certificat ──────────────────────────────────
  info "Demande du certificat (propagation DNS automatique ~30s)…"
  certbot certonly \
    --dns-ovh \
    --dns-ovh-credentials "$OVH_CREDS" \
    --dns-ovh-propagation-seconds 60 \
    --non-interactive \
    --agree-tos \
    --email admin@gis-master.com \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

  # ── Copie des certs ──────────────────────────────────────────
  CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
  cp "$CERT_PATH/fullchain.pem" "$SSL_DIR/tls.crt"
  cp "$CERT_PATH/privkey.pem"   "$SSL_DIR/tls.key"
  REAL_USER="${SUDO_USER:-$USER}"
  chown "$REAL_USER":"$REAL_USER" "$SSL_DIR/tls.crt" "$SSL_DIR/tls.key" 2>/dev/null || true
  log "Certificats copiés dans $SSL_DIR"

  # ── DH params ────────────────────────────────────────────────
  if [[ ! -f "$SSL_DIR/dhparam.pem" ]]; then
    info "Génération de dhparam.pem (2048 bits)…"
    openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048
    log "dhparam.pem généré"
  fi

  # ── Reload Nginx Docker si actif ─────────────────────────────
  docker compose -f "$(dirname "$0")/../docker-compose.yml" exec nginx \
    nginx -s reload 2>/dev/null && log "Nginx rechargé" || \
    info "Nginx pas encore démarré — lancez './scripts/deploy.sh up'"

  # ── Cron renouvellement 100% automatique ─────────────────────
  DEPLOY_DIR="$(cd "$(dirname "$0")/.." && pwd)"
  cat > /etc/cron.d/reaages-certbot-renew << CRON
# Renouvellement auto Let's Encrypt OVH — REAAGES
# Tous les lundis à 3h (renouvelle si < 30j restants)
0 3 * * 1 root certbot renew --quiet \
  --dns-ovh \
  --dns-ovh-credentials ${OVH_CREDS} \
  --post-hook "cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${DEPLOY_DIR}/ssl/tls.crt && \
               cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${DEPLOY_DIR}/ssl/tls.key && \
               docker exec reaages_nginx nginx -s reload"
CRON
  chmod 644 /etc/cron.d/reaages-certbot-renew
  log "Renouvellement automatique configuré (cron hebdo)"

# ── Option B : Auto-signé ─────────────────────────────────────
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
echo "  ✅  Certificats SSL prêts dans : $SSL_DIR"
echo "  🌐  https://$DOMAIN"
echo "  🔄  Renouvellement automatique actif"
echo "═══════════════════════════════════════════════"
