# REAAGES — Guide de Déploiement Docker

**Domaine :** `reaages.gis-master.com`
**HTTPS :** port `443` (standard)
**HTTP :** port `8080` → redirige vers HTTPS

---

## Architecture

```
Internet
   │
   ├─ :80  ──→ Nginx ──→ redirect HTTPS
   └─ :443 ──→ Nginx (SSL/TLS)
                    ├─→ frontend:3000  (Next.js)
                    └─→ backend:3001   (Express)  /api/*
                              │
                    postgres:5432 (réseau interne)
                    keycloak:8080 (réseau interne)
                    keycloak-db:5432 (réseau interne)

127.0.0.1:8090 → Keycloak admin  (localhost uniquement)
```

**Réseaux Docker (isolation stricte) :**
| Réseau | Accès |
|--------|-------|
| `reaages_external` | Nginx ↔ Internet |
| `reaages_internal` | Nginx, frontend, backend, keycloak |
| `reaages_db` | backend ↔ postgres |
| `reaages_keycloak` | keycloak ↔ keycloak-db, backend |

---

## Prérequis Serveur

- Docker ≥ 26 + Docker Compose v2
- Ubuntu 22.04 / Debian 12 recommandé
- Ports `80` et `443` ouverts dans le firewall
- DNS : `reaages.gis-master.com` → IP du serveur

```bash
# Installer Docker (si absent)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

---

## Étape 1 — Cloner le projet

```bash
git clone https://github.com/kambioss/ggw-app-final.git reaages-app
```

---

## Étape 2 — Préparer la structure de déploiement

```bash
# Copier ce dossier deploy/ sur le serveur
scp -r reaages-deploy/ user@serveur:/opt/reaages-deploy/

# Sur le serveur
cd /opt/reaages-deploy

# Lier le code de l'app
mkdir -p app
ln -s /opt/reaages-app/frontend app/frontend
ln -s /opt/reaages-app/backend  app/backend

# Rendre les scripts exécutables
chmod +x scripts/*.sh
```

---

## Étape 3 — Générer les secrets

```bash
./scripts/generate-secrets.sh
```

Ceci crée dans `secrets/` :
- `pg_db.txt`, `pg_user.txt`, `pg_password.txt` → PostgreSQL app
- `kc_pg_db.txt`, `kc_pg_user.txt`, `kc_pg_password.txt` → PostgreSQL Keycloak
- `kc_admin_user.txt`, `kc_admin_password.txt` → Admin Keycloak
- `backend.env` → Variables d'environnement backend
- `frontend.env` → Variables d'environnement frontend

> ⚠ **Ces fichiers ne doivent JAMAIS être committés dans Git.**

---

## Étape 4 — Certificat SSL

### Option A : Let's Encrypt (recommandé)
```bash
sudo apt install certbot
./scripts/setup-ssl.sh letsencrypt
```

### Option B : Auto-signé (test uniquement)
```bash
./scripts/setup-ssl.sh selfsigned
```

---

## Étape 5 — Démarrer la stack

```bash
./scripts/deploy.sh up
```

Le script vérifie automatiquement les prérequis (SSL, secrets) avant de démarrer.

**Accès :**
- 🌐 Application : `https://reaages.gis-master.com`
- 🔑 Keycloak admin : `http://127.0.0.1:8090` (localhost uniquement)

---

## Commandes de gestion

```bash
./scripts/deploy.sh status           # État des conteneurs
./scripts/deploy.sh logs             # Tous les logs
./scripts/deploy.sh logs nginx       # Logs Nginx seulement
./scripts/deploy.sh logs backend     # Logs backend
./scripts/deploy.sh restart nginx    # Redémarrer Nginx
./scripts/deploy.sh backup           # Backup PostgreSQL
./scripts/deploy.sh update           # Mise à jour + rebuild
./scripts/deploy.sh down             # Arrêter la stack
```

---

## Firewall (UFW recommandé)

```bash
sudo ufw allow 80/tcp comment "REAAGES HTTP"
sudo ufw allow 443/tcp comment "REAAGES HTTPS"
# NE PAS exposer 5432, 8090 sur Internet
sudo ufw enable
```

---

## Configuration DNS

Chez votre registrar, ajouter un enregistrement A :

```
reaages.gis-master.com.  →  <IP_DU_SERVEUR>
```

---

## Sécurité — Résumé des mesures

| Mesure | Détail |
|--------|--------|
| TLS 1.2/1.3 uniquement | Nginx |
| Ciphers forts | ECDHE + AES-GCM + ChaCha20 |
| HSTS | max-age 2 ans + preload |
| Headers sécurité | CSP, X-Frame, X-Content-Type, etc. |
| Rate limiting | 30 req/s global, 15/s API, 5/min auth |
| Docker Secrets | Aucun mot de passe en variable d'env |
| Réseaux isolés | DB et Keycloak inaccessibles depuis l'extérieur |
| Utilisateur non-root | Tous les conteneurs app |
| `no-new-privileges` | Tous les conteneurs |
| Ports standards | 443 (HTTPS) / 80 (HTTP) |
| Keycloak admin | `127.0.0.1:8090` uniquement |

---

## Dépannage courant

**Les conteneurs ne démarrent pas :**
```bash
./scripts/deploy.sh logs
docker compose -f docker-compose.yml ps
```

**Certificat SSL expiré :**
```bash
# Let's Encrypt renouvelle automatiquement via cron
# Forcer manuellement :
certbot renew --force-renewal
cp /etc/letsencrypt/live/reaages.gis-master.com/fullchain.pem ssl/tls.crt
cp /etc/letsencrypt/live/reaages.gis-master.com/privkey.pem ssl/tls.key
docker exec reaages_nginx nginx -s reload
```

**Prisma migrations backend :**
```bash
docker exec reaages_backend npx prisma migrate deploy
```

**Prisma migrations frontend (SQLite fallback) :**
```bash
docker exec reaages_frontend bunx prisma db push
```

**Consulter les mots de passe Keycloak :**
```bash
cat secrets/kc_admin_user.txt
cat secrets/kc_admin_password.txt
```
