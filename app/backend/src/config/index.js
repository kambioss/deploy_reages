require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'reaages',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'reaages-jwt-secret-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

admin: {
  email: process.env.ADMIN_EMAIL || 'admin@reaages.org',
  password: process.env.ADMIN_PASSWORD || 'Admin@2024!',
  firstName: process.env.ADMIN_FIRST_NAME || 'Super',
  lastName: process.env.ADMIN_LAST_NAME || 'Admin',
  country: process.env.ADMIN_COUNTRY || 'Togo'
},

  upload: {
    path: process.env.UPLOAD_PATH || 'uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
  },

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
};
