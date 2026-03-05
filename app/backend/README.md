# REAAGES Backend API

Backend API pour le réseau REAAGES (Réseau Africain pour l'Accès à l'Eau, l'Assainissement et la Gestion Environnementale Durable).

## Architecture

- **Node.js** avec **Express.js**
- **PostgreSQL** comme base de données
- **Keycloak** pour l'authentification
- Architecture **MVC** (Models, Views, Controllers)
- **Joi** pour la validation des données
- **Winston** pour le logging

## Installation

### Prérequis

- Node.js 18+
- PostgreSQL 12+
- Keycloak Server

### Configuration

1. Cloner le repository
2. Installer les dépendances :
```bash
cd backend
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. Configurer la base de données PostgreSQL :
```bash
# Créer la base de données
createdb reaages

# Exécuter le schéma
npm run migrate
```

5. Démarrer le serveur :
```bash
npm run dev
```

## Configuration de Keycloak

### 1. Créer un Realm

1. Accéder à la console Keycloak : http://localhost:8080/auth
2. Créer un nouveau realm : `reaages`

### 2. Créer un Client

1. Dans le realm `reaages`, créer un nouveau client :
   - Client ID: `reaages-backend`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:3001/*`

2. Notez le **Client Secret** généré

### 3. Créer des Rôles

Créer les rôles suivants :
- `admin`
- `moderator`
- `member`
- `guest`

## Base de Données

### Structure des Tables

Le schéma SQL complet se trouve dans `database/schema.sql`. Voici les principales tables :

#### Utilisateurs (users)
- Synchronisation avec Keycloak
- Informations de profil
- Rôles et permissions

#### Articles (articles)
- Actualités et nouvelles
- Statut de publication
- Catégories et tags

#### Événements (events)
- Événements du réseau
- Participants
- Dates et lieux

#### Projets (projects)
- Projets structurants
- Progression
- Budget et partenaires

#### Catégories (categories)
- Organisation du contenu
- Hiérarchie parent-enfant

#### Tags (tags)
- Étiquettes pour le contenu
- Compteur d'utilisation

### Requêtes SQL Initiales

```sql
-- Créer la base de données
CREATE DATABASE reaages;

-- Se connecter à la base de données
\c reaages;

-- Exécuter le schéma complet
\i database/schema.sql;
```

## API Endpoints

### Authentification

- `GET /api/auth/config` - Configuration Keycloak
- `POST /api/auth/callback` - Callback Keycloak
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil
- `POST /api/auth/complete-registration` - Compléter l'inscription
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/check` - Vérifier l'authentification

### Articles

- `GET /api/articles` - Lister les articles
- `GET /api/articles/:id` - Détails d'un article
- `GET /api/articles/slug/:slug` - Article par slug
- `POST /api/articles` - Créer un article (authentifié)
- `PUT /api/articles/:id` - Mettre à jour un article (authentifié)
- `DELETE /api/articles/:id` - Supprimer un article (authentifié)
- `POST /api/articles/:id/like` - Liker un article (authentifié)
- `GET /api/articles/recent` - Articles récents
- `GET /api/articles/featured` - Articles en vedette
- `GET /api/articles/search` - Rechercher des articles
- `GET /api/articles/stats` - Statistiques des articles

### Utilisateurs

- `GET /api/users` - Lister les utilisateurs (admin)
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Mettre à jour un utilisateur (admin ou soi-même)
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)
- `GET /api/users/stats/overview` - Statistiques des utilisateurs

### Catégories

- `GET /api/categories` - Lister les catégories
- `GET /api/categories/:id` - Détails d'une catégorie
- `GET /api/categories/slug/:slug` - Catégorie par slug

### Tags

- `GET /api/tags` - Lister les tags
- `GET /api/tags/:id` - Détails d'un tag
- `GET /api/tags/slug/:slug` - Tag par slug
- `GET /api/tags/popular/top` - Tags populaires

### Public

- `GET /api/public/stats` - Statistiques publiques
- `GET /health` - Health check

## Validation des Données

L'API utilise **Joi** pour la validation des données. Exemple pour un article :

```javascript
{
  "title": "Titre de l'article (requis, 1-255 caractères)",
  "slug": "slug-de-l-article (optionnel, 1-255 caractères)",
  "excerpt": "Extrait (optionnel, max 500 caractères)",
  "content": "Contenu de l'article (requis)",
  "featured_image": "URL de l'image (optionnel)",
  "category_id": "UUID de la catégorie (optionnel)",
  "status": "draft|published|archived (optionnel, default: draft)",
  "featured": "true|false (optionnel, default: false)"
}
```

## Sécurité

### Keycloak Integration

L'API utilise Keycloak pour :
- L'authentification des utilisateurs
- La gestion des rôles et permissions
- La validation des tokens JWT

### Permissions

- **admin** : Accès complet à toutes les ressources
- **moderator** : Modération du contenu
- **member** : Création et modification de son propre contenu
- **guest** : Lecture seule

### Rate Limiting

L'API inclut un rate limiting :
- 100 requêtes par 15 minutes par IP
- Protection contre les attaques par force brute

## Logging

L'API utilise Winston pour le logging :
- Niveaux : error, warn, info, debug
- Fichiers : `logs/combined.log`, `logs/error.log`
- Format JSON en production

## Développement

### Scripts Disponibles

```bash
npm run dev      # Démarrer en mode développement
npm start        # Démarrer en mode production
npm test         # Exécuter les tests
npm run lint     # Linter le code
npm run migrate  # Exécuter les migrations
```

### Structure des Fichiers

```
backend/
├── src/
│   ├── app.js              # Application principale
│   ├── config/             # Configuration
│   │   ├── index.js        # Config principale
│   │   └── database.js     # Configuration DB
│   ├── controllers/        # Contrôleurs
│   │   ├── AuthController.js
│   │   └── ArticleController.js
│   ├── models/             # Modèles
│   │   ├── User.js
│   │   └── Article.js
│   ├── routes/             # Routes
│   │   ├── auth.js
│   │   ├── articles.js
│   │   └── users.js
│   ├── middleware/         # Middlewares
│   │   └── validation.js
│   └── utils/              # Utilitaires
│       └── logger.js
├── database/
│   ├── schema.sql          # Schéma SQL complet
│   └── migrate.js          # Script de migration
├── uploads/                # Fichiers uploadés
├── logs/                   # Fichiers de log
└── package.json
```

## Tests

Pour exécuter les tests :

```bash
npm test
```

## Déploiement

### Variables d'Environnement de Production

```bash
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reaages
DB_USER=reaages_user
DB_PASSWORD=secure_password
KEYCLOAK_URL=https://keycloak.example.com/auth
KEYCLOAK_REALM=reaages
KEYCLOAK_CLIENT_ID=reaages-backend
KEYCLOAK_CLIENT_SECRET=client_secret_here
JWT_SECRET=jwt_secret_here
```

### Docker

Un Dockerfile peut être ajouté pour le déploiement containerisé.

## Support

Pour toute question ou problème, veuillez contacter l'équipe de développement REAAGES.