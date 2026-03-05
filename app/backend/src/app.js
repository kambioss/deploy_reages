const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const database = require('./config/database');
const logger = require('./utils/logger');

// Routes
const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const articleRoutes = require('./routes/articles');
const eventRoutes   = require('./routes/events');
const projectRoutes = require('./routes/projects');
const categoryRoutes = require('./routes/categories');
const tagRoutes     = require('./routes/tags');
const commentRoutes = require('./routes/comments');
const mediaRoutes   = require('./routes/media');
const uploadRoutes  = require('./routes/upload');
const actualitesRoutes = require('./routes/actualites');
const coursRoutes      = require('./routes/cours');
const enrollmentsRoutes = require('./routes/enrollments');
const opportunitesRoutes = require('./routes/opportunites');
const appelsOffresRoutes = require('./routes/appels-offres');

const { authenticate, requireAdmin } = require('./middleware/auth');

const app = express();

app.set('trust proxy', 1);

// Sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Trop de requêtes, réessayez plus tard.' }
}));

app.use(compression());
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// API routes — auth publique, le reste protégé
app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);         // middleware authenticate inclus dans la route
app.use('/api/articles',   articleRoutes);
// /api/events is now registered below with full CRUD
// /api/projects is now registered below with full CRUD
app.use('/api/categories', categoryRoutes);
app.use('/api/tags',       tagRoutes);
app.use('/api/comments',   commentRoutes);
app.use('/api/media',      authenticate, mediaRoutes);
app.use('/api/upload',     authenticate, uploadRoutes);
app.use('/api/actualites',  actualitesRoutes);
app.use('/api/cours',       coursRoutes);
app.use('/api/enrollments', authenticate, enrollmentsRoutes);
app.use('/api/opportunites',  opportunitesRoutes);
app.use('/api/appels-offres', appelsOffresRoutes);
// Re-register events & projects with full CRUD
app.use('/api/events',    require('./routes/events'));
app.use('/api/projets',   require('./routes/projects'));

// Stats publiques
app.get('/api/public/stats', async (req, res) => {
  try {
    const [users, articles, events, projects] = await Promise.all([
      database.query('SELECT COUNT(*) FROM users WHERE is_active = true'),
      database.query('SELECT COUNT(*) FROM articles WHERE is_published = true'),
      database.query('SELECT COUNT(*) FROM events'),
      database.query('SELECT COUNT(*) FROM projects'),
    ]);
    res.json({
      users: parseInt(users.rows[0].count),
      articles: parseInt(articles.rows[0].count),
      events: parseInt(events.rows[0].count),
      projects: parseInt(projects.rows[0].count),
    });
  } catch (err) {
    logger.error('Stats error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Fichiers uploadés
app.use('/uploads', express.static('uploads'));

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée', path: req.originalUrl });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée:', err);
  if (err.code?.startsWith('23')) {
    return res.status(400).json({ error: 'Données invalides' });
  }
  res.status(500).json({
    error: 'Erreur serveur',
    message: config.server.env === 'development' ? err.message : undefined
  });
});

// Arrêt propre
process.on('SIGTERM', async () => { await database.close(); process.exit(0); });
process.on('SIGINT',  async () => { await database.close(); process.exit(0); });
process.on('uncaughtException',    (err) => { logger.error('uncaughtException:', err);  process.exit(1); });
process.on('unhandledRejection', (reason) => { logger.error('unhandledRejection:', reason); process.exit(1); });

module.exports = app;

// ─── Démarrage ────────────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    try {
      await database.query('SELECT NOW()');
      logger.info('Base de données connectée');

      await seedAdmin();

      app.listen(config.server.port, config.server.host, () => {
        logger.info(`Serveur démarré sur http://${config.server.host}:${config.server.port}`);
        logger.info(`Environnement : ${config.server.env}`);
      });
    } catch (err) {
      logger.error('Échec du démarrage:', err);
      process.exit(1);
    }
  })();
}

/**
 * Crée l'administrateur par défaut si aucun utilisateur n'existe
 */
async function seedAdmin() {
  const bcrypt = require('bcryptjs');
  const User = require('./models/User');

  const count = await User.count();
  if (count > 0) {
    logger.info(`Base déjà peuplée (${count} utilisateur(s)) — skip seedAdmin`);
    return;
  }

const { email, password, firstName, lastName, country } = config.admin;  const password_hash = await bcrypt.hash(password, 12);

const admin = await User.create({
  email,
  password_hash,
  first_name: firstName,
  last_name: lastName,
  country,          // ✅ ICI
  phone: '',
  function: '',
  sector: '',
  organization: '',
  bio: '',
  avatar_url: '',
  role: 'admin'
});

  logger.info(`✅ Admin par défaut créé : ${admin.email}`);
  logger.info(`   Email    : ${email}`);
  logger.info(`   Password : ${password}`);
  logger.info(`   ⚠️  Changez ce mot de passe après la première connexion !`);
}
