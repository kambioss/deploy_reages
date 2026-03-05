#!/usr/bin/env bash
# ================================================================
#  deploy.sh — Script de déploiement REAAGES
#  Usage : ./scripts/deploy.sh [up|down|restart|logs|status|backup]
# ================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE="docker compose -f $ROOT_DIR/docker-compose.yml"

log()  { echo -e "\033[32m[✔]\033[0m $*"; }
info() { echo -e "\033[34m[→]\033[0m $*"; }
warn() { echo -e "\033[33m[!]\033[0m $*"; }
err()  { echo -e "\033[31m[✘]\033[0m $*"; exit 1; }
sep()  { echo "────────────────────────────────────────"; }

CMD=${1:-"help"}

# ── Pré-vérifications ─────────────────────────────────────────
check_prereqs() {
  command -v docker >/dev/null 2>&1 || err "Docker non installé"
  docker compose version >/dev/null 2>&1 || err "Docker Compose v2 requis"

  [[ -f "$ROOT_DIR/ssl/tls.crt" ]]    || err "SSL manquant. Lancez: ./scripts/setup-ssl.sh"
  [[ -f "$ROOT_DIR/ssl/tls.key" ]]    || err "SSL manquant. Lancez: ./scripts/setup-ssl.sh"
  [[ -f "$ROOT_DIR/ssl/dhparam.pem" ]] || err "dhparam.pem manquant. Lancez: ./scripts/setup-ssl.sh"

  for secret in pg_db pg_user pg_password kc_pg_db kc_pg_user kc_pg_password kc_admin_user kc_admin_password; do
    [[ -f "$ROOT_DIR/secrets/${secret}.txt" ]] || err "Secret manquant: secrets/${secret}.txt — Lancez: ./scripts/generate-secrets.sh"
  done

  [[ -f "$ROOT_DIR/secrets/backend.env" ]]  || err "backend.env manquant"
  [[ -f "$ROOT_DIR/secrets/frontend.env" ]] || err "frontend.env manquant"
}

# ── Démarrage ─────────────────────────────────────────────────
cmd_up() {
  info "Démarrage de la stack REAAGES…"
  check_prereqs
  sep

  info "Build des images…"
  $COMPOSE build --no-cache

  info "Lancement des services…"
  $COMPOSE up -d

  sep
  log "Stack démarrée !"
  echo ""
  echo "  🌐  https://reaages.gis-master.com:8443"
  echo "  🔑  Keycloak admin (local): http://127.0.0.1:8090"
  echo ""
  info "Suivre les logs : ./scripts/deploy.sh logs"
}

# ── Arrêt ─────────────────────────────────────────────────────
cmd_down() {
  warn "Arrêt de la stack…"
  $COMPOSE down
  log "Stack arrêtée"
}

# ── Redémarrage ───────────────────────────────────────────────
cmd_restart() {
  SERVICE=${2:-""}
  if [[ -n "$SERVICE" ]]; then
    info "Redémarrage de $SERVICE…"
    $COMPOSE restart "$SERVICE"
  else
    info "Redémarrage complet…"
    $COMPOSE restart
  fi
  log "Redémarrage effectué"
}

# ── Mise à jour ───────────────────────────────────────────────
cmd_update() {
  info "Mise à jour REAAGES…"
  check_prereqs
  sep

  info "Pull des nouvelles images base…"
  $COMPOSE pull postgres keycloak-db keycloak nginx

  info "Rebuild des apps…"
  $COMPOSE build --no-cache frontend backend

  info "Redémarrage progressif…"
  $COMPOSE up -d --no-deps --remove-orphans
  log "Mise à jour terminée"
}

# ── Logs ──────────────────────────────────────────────────────
cmd_logs() {
  SERVICE=${2:-""}
  if [[ -n "$SERVICE" ]]; then
    $COMPOSE logs -f --tail=100 "$SERVICE"
  else
    $COMPOSE logs -f --tail=50
  fi
}

# ── Status ────────────────────────────────────────────────────
cmd_status() {
  sep
  echo "  Services REAAGES"
  sep
  $COMPOSE ps
  sep
  echo ""
  info "Test HTTPS…"
  curl -sk -o /dev/null -w "  HTTPS 8443 → HTTP %{http_code}\n" \
    https://reaages.gis-master.com:8443/ || warn "Inaccessible (DNS non résolu localement ?)"
}

# ── Backup PostgreSQL ──────────────────────────────────────────
cmd_backup() {
  BACKUP_DIR="$ROOT_DIR/backups"
  mkdir -p "$BACKUP_DIR"
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  FILENAME="$BACKUP_DIR/reaages_db_$TIMESTAMP.sql.gz"

  PG_USER=$(cat "$ROOT_DIR/secrets/pg_user.txt")
  PG_DB=$(cat "$ROOT_DIR/secrets/pg_db.txt")

  info "Backup PostgreSQL vers $FILENAME…"
  docker exec reaages_postgres pg_dump -U "$PG_USER" "$PG_DB" \
    | gzip > "$FILENAME"

  chmod 600 "$FILENAME"
  log "Backup créé : $FILENAME ($(du -sh "$FILENAME" | cut -f1))"
}

# ── Rotation logs Nginx ───────────────────────────────────────
cmd_rotate_logs() {
  info "Rotation des logs Nginx…"
  docker exec reaages_nginx sh -c "
    mv /var/log/nginx/access.log /var/log/nginx/access.log.1
    mv /var/log/nginx/error.log  /var/log/nginx/error.log.1
    nginx -s reopen
  "
  log "Logs Nginx rotés"
}

# ── Aide ──────────────────────────────────────────────────────
cmd_help() {
  echo ""
  echo "  deploy.sh — Gestion REAAGES"
  echo ""
  echo "  Commandes :"
  echo "    up              Démarrer la stack complète"
  echo "    down            Arrêter tous les services"
  echo "    restart [svc]   Redémarrer tout ou un service"
  echo "    update          Rebuilder et redémarrer"
  echo "    logs [svc]      Suivre les logs"
  echo "    status          État des conteneurs"
  echo "    backup          Backup PostgreSQL"
  echo "    rotate-logs     Rotation des logs Nginx"
  echo ""
  echo "  Services : nginx frontend backend postgres keycloak keycloak-db"
  echo ""
}

# ── Router ────────────────────────────────────────────────────
case "$CMD" in
  up)           cmd_up "$@" ;;
  down)         cmd_down ;;
  restart)      cmd_restart "$@" ;;
  update)       cmd_update ;;
  logs)         cmd_logs "$@" ;;
  status)       cmd_status ;;
  backup)       cmd_backup ;;
  rotate-logs)  cmd_rotate_logs ;;
  help|*)       cmd_help ;;
esac
