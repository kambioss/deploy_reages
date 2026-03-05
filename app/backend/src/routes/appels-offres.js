const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

function mapAppel(row) {
  return !row ? null : {
    id: row.id, titre: row.titre, organisation: row.organisation, lieu: row.lieu,
    type: row.type, duree: row.duree, deadline: row.deadline, statut: row.statut,
    description: row.description, requirements: row.requirements ? JSON.parse(row.requirements) : [],
    budget: row.budget, featured: row.featured, published: row.published, createdAt: row.created_at
  };
}

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS appels_offres_reaagess (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL, organisation TEXT DEFAULT '', lieu TEXT DEFAULT '',
    type TEXT DEFAULT 'Consultant', duree TEXT DEFAULT '', deadline DATE, statut TEXT DEFAULT 'open',
    description TEXT DEFAULT '', requirements TEXT DEFAULT '[]', budget TEXT DEFAULT '',
    featured BOOLEAN DEFAULT false, published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`);
}

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const { all } = req.query;
    const q = all === 'true' ? 'SELECT * FROM appels_offres_reaagess ORDER BY created_at DESC' : 'SELECT * FROM appels_offres_reaagess WHERE published=true ORDER BY featured DESC, created_at DESC';
    const r = await database.query(q);
    const appels = r.rows.map(mapAppel);
    res.json({ success: true, appels, data: appels });
  } catch(err) { logger.error('GET /appels-offres:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, organisation='', lieu='', type='Consultant', duree='', deadline, statut='open', description='', requirements=[], budget='', featured=false, published=false } = req.body;
    if (!titre) return res.status(400).json({ error: 'Titre requis' });
    const r = await database.query(
      'INSERT INTO appels_offres_reaagess (titre,organisation,lieu,type,duree,deadline,statut,description,requirements,budget,featured,published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
      [titre,organisation,lieu,type,duree,deadline||null,statut,description,JSON.stringify(requirements),budget,featured===true,published===true]
    );
    res.status(201).json({ success: true, appel: mapAppel(r.rows[0]) });
  } catch(err) { logger.error('POST /appels-offres:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try { await ensureTable(); const r = await database.query('SELECT * FROM appels_offres_reaagess WHERE id=$1',[req.params.id]); if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'}); res.json({success:true,appel:mapAppel(r.rows[0])}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, organisation, lieu, type, duree, deadline, statut, description, requirements, budget, featured, published } = req.body;
    const r = await database.query(
      'UPDATE appels_offres_reaagess SET titre=COALESCE($1,titre), organisation=COALESCE($2,organisation), lieu=COALESCE($3,lieu), type=COALESCE($4,type), duree=COALESCE($5,duree), deadline=$6, statut=COALESCE($7,statut), description=COALESCE($8,description), requirements=COALESCE($9,requirements), budget=COALESCE($10,budget), featured=COALESCE($11,featured), published=COALESCE($12,published), updated_at=NOW() WHERE id=$13 RETURNING *',
      [titre,organisation,lieu,type,duree,deadline||null,statut,description,requirements?JSON.stringify(requirements):null,budget,featured!==undefined?featured===true:null,published!==undefined?published===true:null,req.params.id]
    );
    if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'});
    res.json({success:true,appel:mapAppel(r.rows[0])});
  } catch(err) { logger.error('PUT /appels-offres/:id:', err); res.status(500).json({error:'Erreur serveur'}); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await ensureTable(); await database.query('DELETE FROM appels_offres_reaagess WHERE id=$1',[req.params.id]); res.json({success:true,message:'Supprimé'}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

module.exports = router;
