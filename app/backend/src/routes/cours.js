const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

function mapCours(row) { return !row ? null : { id:row.id, titre:row.titre, description:row.description||'', contenu:row.contenu||'', instructeur:row.instructeur||'', duree:row.duree||'', niveau:row.niveau||'debutant', categorie:row.categorie||'', prix:row.prix||0, image:row.image||null, published:row.published||false, createdAt:row.created_at||null, enrollments:[] }; }

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS cours_reaagess (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), titre TEXT NOT NULL, description TEXT DEFAULT '', contenu TEXT DEFAULT '', instructeur TEXT DEFAULT '', duree TEXT DEFAULT '', niveau TEXT DEFAULT 'debutant', categorie TEXT DEFAULT '', prix NUMERIC DEFAULT 0, image TEXT, published BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`);
}

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const { all } = req.query;
    const q = all==='true' ? 'SELECT * FROM cours_reaagess ORDER BY created_at DESC' : 'SELECT * FROM cours_reaagess WHERE published=true ORDER BY created_at DESC';
    const r = await database.query(q);
    const cours = r.rows.map(mapCours);
    res.json({ success: true, cours, data: cours });
  } catch(err) { logger.error('GET /cours:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, description='', contenu='', instructeur='', duree='', niveau='debutant', categorie='', prix=0, image, published=false } = req.body;
    if (!titre) return res.status(400).json({ error: 'Titre requis' });
    const r = await database.query('INSERT INTO cours_reaagess (titre,description,contenu,instructeur,duree,niveau,categorie,prix,image,published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *', [titre,description,contenu,instructeur,duree,niveau,categorie,parseFloat(prix)||0,image||null,published===true]);
    res.status(201).json({ success: true, cours: mapCours(r.rows[0]) });
  } catch(err) { logger.error('POST /cours:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try { await ensureTable(); const r = await database.query('SELECT * FROM cours_reaagess WHERE id=$1',[req.params.id]); if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'}); res.json({success:true,cours:mapCours(r.rows[0])}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, description, contenu, instructeur, duree, niveau, categorie, prix, image, published } = req.body;
    const r = await database.query('UPDATE cours_reaagess SET titre=COALESCE($1,titre), description=COALESCE($2,description), contenu=COALESCE($3,contenu), instructeur=COALESCE($4,instructeur), duree=COALESCE($5,duree), niveau=COALESCE($6,niveau), categorie=COALESCE($7,categorie), prix=COALESCE($8,prix), image=$9, published=COALESCE($10,published), updated_at=NOW() WHERE id=$11 RETURNING *', [titre,description,contenu,instructeur,duree,niveau,categorie,prix!==undefined?parseFloat(prix)||0:null,image||null,published!==undefined?published===true:null,req.params.id]);
    if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'});
    res.json({success:true,cours:mapCours(r.rows[0])});
  } catch(err) { logger.error('PUT /cours/:id:', err); res.status(500).json({error:'Erreur serveur'}); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await ensureTable(); await database.query('DELETE FROM cours_reaagess WHERE id=$1',[req.params.id]); res.json({success:true,message:'Supprimé'}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

module.exports = router;
