# Configuration de Keycloak pour REAAGES

Ce guide explique comment configurer Keycloak pour l'authentification du backend REAAGES.

## Prérequis

- Docker et Docker Compose (recommandé) ou
- Java 11+ et Keycloak serveur

## Option 1: Docker (Recommandé)

### 1. Créer un fichier docker-compose.yml

```yaml
version: '3.8'

services:
  keycloak:
    image: quay.io/keycloak/keycloak:23.0.0
    container_name: reaages-keycloak
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin123
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: keycloak123
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    command: start-dev

  postgres:
    image: postgres:15
    container_name: reaages-keycloak-db
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: keycloak123
    volumes:
      - keycloak_data:/var/lib/postgresql/data
    ports:
      - "5433:5432"

volumes:
  keycloak_data:
```

### 2. Démarrer Keycloak

```bash
docker-compose up -d
```

### 3. Accéder à la console

- URL: http://localhost:8080
- Username: admin
- Password: admin123

## Option 2: Installation Manuelle

### 1. Télécharger Keycloak

```bash
wget https://github.com/keycloak/keycloak/releases/download/23.0.0/keycloak-23.0.0.tar.gz
tar -xzf keycloak-23.0.0.tar.gz
cd keycloak-23.0.0
```

### 2. Configurer et démarrer

```bash
# Démarrer en mode développement
./kc.sh start-dev

# Ou avec configuration personnalisée
./kc.sh start-dev --http-port=8080 --hostname-strict=false
```

## Configuration du Realm REAAGES

### 1. Créer le Realm

1. Connectez-vous à la console d'administration
2. Cliquez sur "Add realm"
3. Nom du realm: `reaages`
4. Cliquez sur "Create"

### 2. Créer le Client Backend

1. Allez dans "Clients" dans le realm `reaages`
2. Cliquez sur "Create"
3. Configuration:
   - Client ID: `reaages-backend`
   - Client Protocol: `openid-connect`
   - Root URL: `http://localhost:3001`
4. Cliquez sur "Create"
5. Dans l'onglet "Settings":
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:3001/*`
   - Web Origins: `http://localhost:3001`
6. Cliquez sur "Save"
7. Allez dans l'onglet "Credentials" pour noter le "Client Secret"

### 3. Créer le Client Frontend (Optionnel)

1. Créez un nouveau client:
   - Client ID: `reaages-frontend`
   - Client Protocol: `openid-connect`
   - Root URL: `http://localhost:3000`
2. Configuration:
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:3000/*`
   - Web Origins: `http://localhost:3000`

### 4. Créer les Rôles

1. Allez dans "Roles"
2. Cliquez sur "Add Role"
3. Créez les rôles suivants:
   - `admin`
   - `moderator`
   - `member`
   - `guest`

### 5. Créer un Utilisateur Test

1. Allez dans "Users"
2. Cliquez sur "Add user"
3. Informations:
   - Username: `test@reaages.org`
   - Email: `test@reaages.org`
   - First Name: `Test`
   - Last Name: `User`
4. Allez dans l'onglet "Credentials"
5. Définissez un mot de passe
6. Allez dans l'onglet "Role Mappings"
7. Assignez le rôle `member`

## Configuration du Backend

### 1. Mettre à jour le fichier .env

```bash
# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080/auth
KEYCLOAK_REALM=reaages
KEYCLOAK_CLIENT_ID=reaages-backend
KEYCLOAK_CLIENT_SECRET=votre_client_secret_ici
```

### 2. Tester la configuration

Démarrez le backend et testez l'endpoint:

```bash
curl http://localhost:3001/api/auth/config
```

## Configuration du Frontend

Pour une application React/Next.js, vous pouvez utiliser:

### 1. Installation des dépendances

```bash
npm install @keycloak/keycloak-js
```

### 2. Configuration du client Keycloak

```javascript
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'reaages',
  clientId: 'reaages-frontend'
});

export default keycloak;
```

## Endpoints Utiles

- Console d'administration: http://localhost:8080
- Configuration OpenID: http://localhost:8080/auth/realms/reaages/.well-known/openid_configuration
- JWK Set: http://localhost:8080/auth/realms/reaages/protocol/openid-connect/certs

## Dépannage

### Problèmes Communs

1. **"Client not found"**
   - Vérifiez que le client ID est correct
   - Vérifiez que vous êtes dans le bon realm

2. **"Invalid redirect URI"**
   - Vérifiez les "Valid Redirect URIs" dans la configuration du client
   - Assurez-vous que l'URL correspond exactement

3. **"Access denied"**
   - Vérifiez que l'utilisateur a les rôles nécessaires
   - Vérifiez la configuration des "Web Origins"

4. **"Database connection failed"**
   - Assurez-vous que PostgreSQL est en cours d'exécution
   - Vérifiez les identifiants de la base de données

### Logs

Pour voir les logs de Keycloak:

```bash
# Avec Docker
docker logs reaages-keycloak

# Avec installation manuelle
# Les logs sont dans le dossier logs/ de Keycloak
```

## Sécurité

### En Production

1. Changez les mots de passe par défaut
2. Utilisez HTTPS
3. Configurez un realm de production séparé
4. Limitez les "Web Origins" aux domaines autorisés
5. Utilisez des "Client Secrets" forts
6. Activez la validation des emails
7. Configurez les politiques de mots de passe

### Variables d'Environnement

Pour la production:

```bash
KC_HOSTNAME=https://auth.reaages.org
KC_HTTPS_CERTIFICATE_FILE=/path/to/cert.pem
KC_HTTPS_CERTIFICATE_KEY_FILE=/path/to/key.pem
KC_DB_URL=jdbc:postgresql://prod-db:5432/keycloak
KC_DB_USERNAME=keycloak
KC_DB_PASSWORD=secure_password
```

## Support

Pour plus d'informations:
- Documentation Keycloak: https://www.keycloak.org/documentation
- Community: https://keycloak.discourse.group
- Issues: https://github.com/keycloak/keycloak/issues