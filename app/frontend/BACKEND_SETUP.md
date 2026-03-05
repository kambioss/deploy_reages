# 🎯 REAAGES Backend - Guide d'Installation et d'Utilisation

## 📋 Vue d'ensemble

J'ai créé un backend complet et robuste pour votre réseau REAAGES avec les caractéristiques suivantes :

### ✅ Architecture Technique
- **Node.js + Express.js** : Framework backend performant
- **PostgreSQL** : Base de données relationnelle robuste
- **Keycloak** : Authentification centralisée avec JWT
- **Architecture MVC** : Séparation claire des responsabilités
- **Joi** : Validation des données
- **Winston** : Logging structuré
- **Rate Limiting** : Protection contre les attaques

### 🗄️ Base de Données PostgreSQL

#### Tables Principales
- **users** : Utilisateurs synchronisés avec Keycloak
- **articles** : Actualités et nouvelles
- **events** : Événements et activités
- **projects** : Projets structurants
- **categories** : Catégories de contenu
- **tags** : Étiquettes pour le contenu
- **comments** : Système de commentaires
- **media** : Gestion des fichiers
- **activity_logs** : Journal d'activité

#### Requêtes SQL à Exécuter

1. **Créer la base de données** :
```sql
CREATE DATABASE reaages;
```

2. **Exécuter le schéma complet** :
```bash
cd backend
psql -d reaages -f database/schema.sql
```

Ou utilisez le script de migration :
```bash
npm run migrate
```

### 🔐 Authentification Keycloak

#### Configuration de Keycloak
1. **Démarrer Keycloak** (Docker recommandé) :
```bash
# Avec Docker
docker run -p 8080:8080 quay.io/keycloak/keycloak:23.0.0 start-dev

# Ou avec docker-compose inclus
docker-compose up keycloak
```

2. **Accéder à la console** : http://localhost:8080
   - Username: `admin`
   - Password: `admin123`

3. **Créer le realm** :
   - Nom: `reaages`

4. **Créer le client backend** :
   - Client ID: `reaages-backend`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:3001/*`

5. **Créer les rôles** :
   - `admin`, `moderator`, `member`, `guest`

### 🚀 Démarrage Rapide

#### 1. Configuration de l'environnement
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos configurations
```

#### 2. Installation des dépendances
```bash
npm install
```

#### 3. Configuration de la base de données
```bash
# Créer la base de données PostgreSQL
createdb reaages

# Exécuter les migrations
npm run migrate
```

#### 4. Démarrer le serveur
```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:3001`

### 📡 API Endpoints

#### Authentification
- `GET /api/auth/config` - Configuration Keycloak
- `POST /api/auth/callback` - Callback après authentification
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil
- `POST /api/auth/complete-registration` - Compléter l'inscription
- `POST /api/auth/logout` - Déconnexion

#### Articles (Actualités)
- `GET /api/articles` - Lister les articles
- `GET /api/articles/:id` - Détails d'un article
- `POST /api/articles` - Créer un article (authentifié)
- `PUT /api/articles/:id` - Mettre à jour un article (authentifié)
- `DELETE /api/articles/:id` - Supprimer un article (authentifié)
- `GET /api/articles/search` - Rechercher des articles

#### Utilisateurs
- `GET /api/users` - Lister les utilisateurs (admin)
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Mettre à jour un utilisateur

#### Catégories et Tags
- `GET /api/categories` - Lister les catégories
- `GET /api/tags` - Lister les tags

### 🔧 Configuration du Fichier .env

```bash
# Server
NODE_ENV=development
PORT=3001

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reaages
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# Keycloak
KEYCLOAK_URL=http://localhost:8080/auth
KEYCLOAK_REALM=reaages
KEYCLOAK_CLIENT_ID=reaages-backend
KEYCLOAK_CLIENT_SECRET=votre_client_secret

# Sécurité
JWT_SECRET=votre_jwt_secret
SESSION_SECRET=votre_session_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

### 🐳 Docker (Optionnel)

Pour tout démarrer avec Docker :
```bash
docker-compose up -d
```

Cela démarrera :
- PostgreSQL sur le port 5432
- Keycloak sur le port 8080
- Backend API sur le port 3001

### 📊 Fonctionnalités Implémentées

#### ✅ Authentification & Sécurité
- Intégration complète avec Keycloak
- Gestion des rôles et permissions
- Tokens JWT sécurisés
- Rate limiting
- Validation des entrées

#### ✅ Gestion des Articles
- CRUD complet
- Recherche plein texte
- Catégories et tags
- Statistiques de vues
- Système de likes

#### ✅ Gestion des Utilisateurs
- Synchronisation avec Keycloak
- Profils détaillés
- Permissions granulaires
- Statistiques

#### ✅ Base de Données
- Schema complet et optimisé
- Indexes pour les performances
- Triggers pour l'intégrité
- Vues pour les requêtes complexes

### 🧪 Tests et Développement

#### Scripts disponibles
```bash
npm run dev      # Mode développement
npm start        # Mode production
npm test         # Tests
npm run lint     # Linting
npm run migrate  # Migrations DB
```

#### Structure des fichiers
```
backend/
├── src/
│   ├── app.js              # Application principale
│   ├── config/             # Configuration
│   ├── controllers/        # Logique métier
│   ├── models/             # Modèles de données
│   ├── routes/             # Routes API
│   ├── middleware/         # Middlewares
│   └── utils/              # Utilitaires
├── database/
│   ├── schema.sql          # Schema SQL complet
│   └── migrate.js          # Script de migration
├── docs/                   # Documentation
├── uploads/                # Fichiers uploadés
└── logs/                   # Logs
```

### 🔍 Points d'Attention

1. **Sécurité** :
   - Changez tous les mots de passe par défaut
   - Utilisez HTTPS en production
   - Configurez correctement les CORS

2. **Base de données** :
   - Assurez-vous que PostgreSQL est en cours d'exécution
   - Vérifiez les identifiants de connexion
   - Exécutez les migrations avant de démarrer

3. **Keycloak** :
   - Configurez le realm et les clients correctement
   - Notez le client secret pour la configuration
   - Testez l'authentification avant de continuer

### 📚 Documentation Complète

- **README.md** : Documentation complète du backend
- **docs/keycloak-setup.md** : Guide détaillé pour Keycloak
- **database/schema.sql** : Schema SQL commenté

### 🎉 Prochaines Étapes

1. **Configurer Keycloak** : Suivez le guide dans `docs/keycloak-setup.md`
2. **Tester l'API** : Utilisez Postman ou curl pour tester les endpoints
3. **Connecter le frontend** : Intégrez l'API avec votre application Next.js
4. **Déployer** : Configurez pour la production avec Docker

---

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation dans `backend/README.md`
2. Vérifiez les logs dans `backend/logs/`
3. Testez avec les scripts fournis

Le backend est maintenant prêt à être utilisé ! 🚀