const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const config = require('./config');
const database = require('./config/database');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const eventRoutes = require('./routes/events');
const projectRoutes = require('./routes/projects');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const commentRoutes = require('./routes/comments');
const mediaRoutes = require('./routes/media');
const uploadRoutes = require('./routes/upload');

// Create Express app
const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Compression
app.use(compression());

// CORS configuration
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration for Keycloak
const memoryStore = new session.MemoryStore();
app.use(session(config.session));

// Keycloak configuration
const keycloak = new Keycloak({
  store: memoryStore
}, config.keycloak);

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', keycloak.protect(), userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/media', keycloak.protect(), mediaRoutes);
app.use('/api/upload', keycloak.protect(), uploadRoutes);

// Public routes (no authentication required)
app.get('/api/public/stats', async (req, res) => {
  try {
    const result = await database.query('SELECT get_database_stats() as stats');
    res.json(result.rows[0].stats);
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  
  // Keycloak errors
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  
  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message
    });
  }
  
  // Database errors
  if (error.code && error.code.startsWith('23')) {
    return res.status(400).json({
      error: 'Database Error',
      message: 'Invalid data provided'
    });
  }
  
  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.server.env === 'development' ? error.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await database.close();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await database.query('SELECT NOW()');
    logger.info('Database connection established');
    
    // Start server
    app.listen(config.server.port, config.server.host, () => {
      logger.info(`Server running on ${config.server.host}:${config.server.port}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`API documentation: http://${config.server.host}:${config.server.port}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}