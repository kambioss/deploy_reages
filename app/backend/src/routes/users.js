const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Toutes les routes utilisateurs requièrent authentification
router.use(authenticate);

// GET /api/users  — admin seulement
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, country, sector, role, is_active, search } = req.query;
    const result = await User.findAll({
      page: parseInt(page), limit: parseInt(limit),
      country, sector, role,
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
      search
    });
    res.json({ success: true, users: result.users, data: result.users, pagination: result.pagination });
  } catch (err) {
    logger.error('GET /users:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/users — admin: créer un utilisateur
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { email, password, first_name, last_name, prenom, nom, pays, country, role = 'member', phone, sector, organization } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email, password_hash,
      first_name: first_name || prenom || '',
      last_name:  last_name  || nom   || '',
      country:    country    || pays  || null,
      phone: phone || null,
      sector: sector || null,
      organization: organization || null,
      role
    });
    res.status(201).json({ success: true, user });
  } catch (err) {
    logger.error('POST /users:', err);
    if (err.code === '23505') return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ success: true, data: user });
  } catch (err) {
    logger.error('GET /users/:id:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/:id — admin seulement
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let extra = {};
    if (password) extra.password_hash = await bcrypt.hash(password, 12);
    const user = await User.update(req.params.id, { ...rest, ...extra });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ success: true, data: user, user });
  } catch (err) {
    logger.error('PUT /users/:id:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/users/:id — admin seulement
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ error: 'Impossible de supprimer votre propre compte' });
    }
    const user = await User.delete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (err) {
    logger.error('DELETE /users/:id:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
