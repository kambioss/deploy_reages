const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const logger = require('../utils/logger');

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { email, password, first_name, last_name, country, function: fn, sector, phone, organization } = req.body;

      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
      }

      if (await User.existsByEmail(email)) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé' });
      }

      const password_hash = await bcrypt.hash(password, 12);
      const userCount = await User.count();
      const role = userCount === 0 ? 'admin' : 'member';

      const user = await User.create({
        email, password_hash, first_name, last_name,
        country, function: fn, sector, phone, organization, role
      });

      const token = signToken(user);

      logger.info(`Nouvel utilisateur enregistré: ${email} (rôle: ${role})`);

      res.status(201).json({
        message: 'Compte créé avec succès',
        token,
        user: {
          id: user.id, email: user.email,
          first_name: user.first_name, last_name: user.last_name,
          role: user.role
        }
      });
    } catch (err) {
      logger.error('Erreur register:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      if (!user.is_active) {
        return res.status(403).json({ error: 'Compte désactivé. Contactez l\'administrateur.' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      await User.updateLastLogin(user.id);
      const token = signToken(user);

      logger.info(`Connexion réussie: ${email}`);

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id, email: user.email,
          first_name: user.first_name, last_name: user.last_name,
          role: user.role, country: user.country,
          function: user.function, sector: user.sector
        }
      });
    } catch (err) {
      logger.error('Erreur login:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
      res.json({ user });
    } catch (err) {
      logger.error('Erreur getMe:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res) {
    try {
      const { password, new_password, ...rest } = req.body;

      let extra = {};
      if (new_password) {
        const user = await User.findByEmail(req.user.email);
        if (!password || !(await bcrypt.compare(password, user.password_hash))) {
          return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
        }
        if (new_password.length < 8) {
          return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
        }
        extra.password_hash = await bcrypt.hash(new_password, 12);
      }

      const updated = await User.update(req.user.userId, { ...rest, ...extra });
      res.json({ message: 'Profil mis à jour', user: updated });
    } catch (err) {
      logger.error('Erreur updateProfile:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * POST /api/auth/logout
   */
  static logout(req, res) {
    // Côté serveur rien à faire (JWT stateless)
    res.json({ message: 'Déconnexion réussie' });
  }
}

module.exports = AuthController;
