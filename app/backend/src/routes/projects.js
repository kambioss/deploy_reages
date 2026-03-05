const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

function mapProject(row) {
  if (!row) return null;
  return { id: row.id, titre: row.titre, description: row.description||'', contenu: row.contenu||'', statut: row.statut||'en_cours', partenaires: row.partenaires||'', image: row.image||null, published: row.published||false, createdAt: row.created_at||null };
}

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS projects_reaagess (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), titre TEXT NOT NULL, description TEXT DEFAULT '', contenu TEXT DEFAULT '', statut TEXT DEFAULT 'en_cours', partenaires TEXT DEFAULT '', image TEXT, published BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`);
}

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const { all } = req.query;
    const q = all==='true' ? 'SELECT * FROM projects_reaagess ORDER BY created_at DESC' : 'SELECT * FROM projects_reaagess WHERE published=true ORDER BY created_at DESC';
    const r = await database.query(q);
    const projets = r.rows.map(mapProject);
    res.json({ success: true, projets, data: projets });
  } catch(err) { logger.error('GET /projects:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, description='', contenu='', statut='en_cours', partenaires='', image, published=false } = req.body;
    if (!titre) return res.status(400).json({ error: 'Titre requis' });
    const r = await database.query('INSERT INTO projects_reaagess (titre,description,contenu,statut,partenaires,image,published) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [titre,description,contenu,statut,partenaires,image||null,published===true]);
    res.status(201).json({ success: true, projet: mapProject(r.rows[0]) });
  } catch(err) { logger.error('POST /projects:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    await ensureTable();
    const r = await database.query('SELECT * FROM projects_reaagess WHERE id=$1', [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true, projet: mapProject(r.rows[0]) });
  } catch(err) { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, description, contenu, statut, partenaires, image, published } = req.body;
    const r = await database.query('UPDATE projects_reaagess SET titre=COALESCE($1,titre), description=COALESCE($2,description), contenu=COALESCE($3,contenu), statut=COALESCE($4,statut), partenaires=COALESCE($5,partenaires), image=$6, published=COALESCE($7,published), updated_at=NOW() WHERE id=$8 RETURNING *', [titre,description,contenu,statut,partenaires,image||null,published!==undefined?published===true:null,req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true, projet: mapProject(r.rows[0]) });
  } catch(err) { logger.error('PUT /projects/:id:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    await database.query('DELETE FROM projects_reaagess WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Supprimé' });
  } catch(err) { res.status(500).json({ error: 'Erreur serveur' }); }
});

module.exports = router;
