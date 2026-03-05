const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

function mapActualite(row) {
  if (!row) return null;
  return { id: row.id, titre: row.titre, contenu: row.contenu||'', auteur: row.auteur||'', categorie: row.categorie||'actualite', image: row.image||null, published: row.published||false, date: row.created_at||null, createdAt: row.created_at||null };
}

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS actualites_reaagess (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), titre TEXT NOT NULL, contenu TEXT DEFAULT '', auteur TEXT DEFAULT '', categorie TEXT DEFAULT 'actualite', image TEXT, published BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`);
}

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const { all } = req.query;
    const q = all==='true' ? 'SELECT * FROM actualites_reaagess ORDER BY created_at DESC' : 'SELECT * FROM actualites_reaagess WHERE published=true ORDER BY created_at DESC';
    const r = await database.query(q);
    const actualites = r.rows.map(mapActualite);
    res.json({ success: true, actualites, data: actualites });
  } catch(err) { logger.error('GET /actualites:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, contenu='', auteur='', categorie='actualite', image, published=false } = req.body;
    if (!titre) return res.status(400).json({ error: 'Titre requis' });
    const r = await database.query('INSERT INTO actualites_reaagess (titre,contenu,auteur,categorie,image,published) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [titre,contenu,auteur,categorie,image||null,published===true]);
    res.status(201).json({ success: true, actualite: mapActualite(r.rows[0]) });
  } catch(err) { logger.error('POST /actualites:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    await ensureTable();
    const r = await database.query('SELECT * FROM actualites_reaagess WHERE id=$1', [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true, actualite: mapActualite(r.rows[0]) });
  } catch(err) { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, contenu, auteur, categorie, image, published } = req.body;
    const r = await database.query('UPDATE actualites_reaagess SET titre=COALESCE($1,titre), contenu=COALESCE($2,contenu), auteur=COALESCE($3,auteur), categorie=COALESCE($4,categorie), image=$5, published=COALESCE($6,published), updated_at=NOW() WHERE id=$7 RETURNING *', [titre,contenu,auteur,categorie,image||null,published!==undefined?published===true:null,req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true, actualite: mapActualite(r.rows[0]) });
  } catch(err) { logger.error('PUT /actualites/:id:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    await database.query('DELETE FROM actualites_reaagess WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Supprimé' });
  } catch(err) { res.status(500).json({ error: 'Erreur serveur' }); }
});

module.exports = router;
