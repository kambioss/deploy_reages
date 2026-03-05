const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

function mapEvent(row) {
  if (!row) return null;
  return { id: row.id, titre: row.titre, description: row.description||'', lieu: row.lieu||'', date: row.date||null, lien: row.lien||null, image: row.image||null, published: row.published||false, createdAt: row.created_at||null };
}

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS events_reaagess (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), titre TEXT NOT NULL, description TEXT DEFAULT '', lieu TEXT DEFAULT '', date TIMESTAMPTZ, lien TEXT, image TEXT, published BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`);
}

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const { all } = req.query;
    const q = all === 'true' ? 'SELECT * FROM events_reaagess ORDER BY created_at DESC' : 'SELECT * FROM events_reaagess WHERE published=true ORDER BY date DESC NULLS LAST';
    const result = await database.query(q);
    const evenements = result.rows.map(mapEvent);
    res.json({ success: true, evenements, data: evenements });
  } catch(err) { logger.error('GET /events:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, description='', lieu='', date, lien, image, published=false } = req.body;
    if (!titre) return res.status(400).json({ error: 'Titre requis' });
    const r = await database.query('INSERT INTO events_reaagess (titre,description,lieu,date,lien,image,published) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [titre,description,lieu,date||null,lien||null,image||null,published===true]);
    res.status(201).json({ success: true, evenement: mapEvent(r.rows[0]) });
  } catch(err) { logger.error('POST /events:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    await ensureTable();
    const r = await database.query('SELECT * FROM events_reaagess WHERE id=$1', [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true, evenement: mapEvent(r.rows[0]) });
  } catch(err) { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, description, lieu, date, lien, image, published } = req.body;
    const r = await database.query('UPDATE events_reaagess SET titre=COALESCE($1,titre), description=COALESCE($2,description), lieu=COALESCE($3,lieu), date=COALESCE($4,date), lien=$5, image=$6, published=COALESCE($7,published), updated_at=NOW() WHERE id=$8 RETURNING *', [titre,description,lieu,date||null,lien||null,image||null,published!==undefined?published===true:null,req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true, evenement: mapEvent(r.rows[0]) });
  } catch(err) { logger.error('PUT /events/:id:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    await database.query('DELETE FROM events_reaagess WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Supprimé' });
  } catch(err) { res.status(500).json({ error: 'Erreur serveur' }); }
});

module.exports = router;
