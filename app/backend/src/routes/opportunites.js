const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

function mapOpp(row) {
  return !row ? null : {
    id: row.id, titre: row.titre, type: row.type, organisation: row.organisation,
    lieu: row.lieu, description: row.description, dateLimit: row.date_limit,
    avantages: row.avantages ? JSON.parse(row.avantages) : [],
    niveau: row.niveau, featured: row.featured, published: row.published,
    createdAt: row.created_at
  };
}

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS opportunites_reaagess (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL, type TEXT DEFAULT 'Bourse', organisation TEXT DEFAULT '',
    lieu TEXT DEFAULT '', description TEXT DEFAULT '', date_limit DATE,
    avantages TEXT DEFAULT '[]', niveau TEXT DEFAULT '', featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`);
}

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const { all } = req.query;
    const q = all === 'true' ? 'SELECT * FROM opportunites_reaagess ORDER BY created_at DESC' : 'SELECT * FROM opportunites_reaagess WHERE published=true ORDER BY featured DESC, created_at DESC';
    const r = await database.query(q);
    const opportunites = r.rows.map(mapOpp);
    res.json({ success: true, opportunites, data: opportunites });
  } catch(err) { logger.error('GET /opportunites:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, type='Bourse', organisation='', lieu='', description='', dateLimit, avantages=[], niveau='', featured=false, published=false } = req.body;
    if (!titre) return res.status(400).json({ error: 'Titre requis' });
    const r = await database.query(
      'INSERT INTO opportunites_reaagess (titre,type,organisation,lieu,description,date_limit,avantages,niveau,featured,published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [titre,type,organisation,lieu,description,dateLimit||null,JSON.stringify(avantages),niveau,featured===true,published===true]
    );
    res.status(201).json({ success: true, opportunite: mapOpp(r.rows[0]) });
  } catch(err) { logger.error('POST /opportunites:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try { await ensureTable(); const r = await database.query('SELECT * FROM opportunites_reaagess WHERE id=$1',[req.params.id]); if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'}); res.json({success:true,opportunite:mapOpp(r.rows[0])}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, type, organisation, lieu, description, dateLimit, avantages, niveau, featured, published } = req.body;
    const r = await database.query(
      'UPDATE opportunites_reaagess SET titre=COALESCE($1,titre), type=COALESCE($2,type), organisation=COALESCE($3,organisation), lieu=COALESCE($4,lieu), description=COALESCE($5,description), date_limit=$6, avantages=COALESCE($7,avantages), niveau=COALESCE($8,niveau), featured=COALESCE($9,featured), published=COALESCE($10,published), updated_at=NOW() WHERE id=$11 RETURNING *',
      [titre,type,organisation,lieu,description,dateLimit||null,avantages?JSON.stringify(avantages):null,niveau,featured!==undefined?featured===true:null,published!==undefined?published===true:null,req.params.id]
    );
    if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'});
    res.json({success:true,opportunite:mapOpp(r.rows[0])});
  } catch(err) { logger.error('PUT /opportunites/:id:', err); res.status(500).json({error:'Erreur serveur'}); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await ensureTable(); await database.query('DELETE FROM opportunites_reaagess WHERE id=$1',[req.params.id]); res.json({success:true,message:'Supprimé'}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

module.exports = router;
