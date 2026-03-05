const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Middleware : vérifie le JWT et attache req.user
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Token manquant', message: 'Authentification requise' });
    }

    const payload = jwt.verify(token, config.jwt.secret);
    req.user = payload;
    next();
  } catch (err) {
    logger.warn('JWT invalide:', err.message);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

/**
 * Middleware : vérifie que l'utilisateur est admin
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé', message: 'Droits administrateur requis' });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
