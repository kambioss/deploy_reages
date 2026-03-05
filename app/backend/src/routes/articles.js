const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

function mapArticle(row) {
  return !row ? null : {
    id: row.id, titre: row.titre, resume: row.resume || '', contenu: row.contenu || '',
    auteur: row.auteur || '', categorie: row.categorie || 'publication',
    tags: row.tags || '', image: row.image || null, published: row.published || false,
    createdAt: row.created_at || null, updatedAt: row.updated_at || null
  };
}

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS articles_reaagess (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL, resume TEXT DEFAULT '', contenu TEXT DEFAULT '',
    auteur TEXT DEFAULT '', categorie TEXT DEFAULT 'publication', tags TEXT DEFAULT '',
    image TEXT, published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`);
}

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const { all } = req.query;
    const q = all === 'true'
      ? 'SELECT * FROM articles_reaagess ORDER BY created_at DESC'
      : 'SELECT * FROM articles_reaagess WHERE published=true ORDER BY created_at DESC';
    const r = await database.query(q);
    const articles = r.rows.map(mapArticle);
    res.json({ success: true, articles, data: articles });
  } catch(err) { logger.error('GET /articles:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, resume='', contenu='', auteur='', categorie='publication', tags='', image, published=false } = req.body;
    if (!titre) return res.status(400).json({ error: 'Titre requis' });
    const r = await database.query(
      'INSERT INTO articles_reaagess (titre,resume,contenu,auteur,categorie,tags,image,published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [titre, resume, contenu, auteur, categorie, tags, image || null, published === true]
    );
    res.status(201).json({ success: true, article: mapArticle(r.rows[0]) });
  } catch(err) { logger.error('POST /articles:', err); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/recent', async (req, res) => {
  try { await ensureTable(); const r = await database.query('SELECT * FROM articles_reaagess WHERE published=true ORDER BY created_at DESC LIMIT 5'); res.json({ success: true, articles: r.rows.map(mapArticle) }); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

router.get('/:id', async (req, res) => {
  try { await ensureTable(); const r = await database.query('SELECT * FROM articles_reaagess WHERE id=$1', [req.params.id]); if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'}); res.json({success:true, article:mapArticle(r.rows[0])}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await ensureTable();
    const { titre, resume, contenu, auteur, categorie, tags, image, published } = req.body;
    const r = await database.query(
      'UPDATE articles_reaagess SET titre=COALESCE($1,titre), resume=COALESCE($2,resume), contenu=COALESCE($3,contenu), auteur=COALESCE($4,auteur), categorie=COALESCE($5,categorie), tags=COALESCE($6,tags), image=$7, published=COALESCE($8,published), updated_at=NOW() WHERE id=$9 RETURNING *',
      [titre, resume, contenu, auteur, categorie, tags, image||null, published!==undefined?published===true:null, req.params.id]
    );
    if(!r.rows[0]) return res.status(404).json({error:'Non trouvé'});
    res.json({success:true, article:mapArticle(r.rows[0])});
  } catch(err) { logger.error('PUT /articles/:id:', err); res.status(500).json({error:'Erreur serveur'}); }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await ensureTable(); await database.query('DELETE FROM articles_reaagess WHERE id=$1', [req.params.id]); res.json({success:true, message:'Supprimé'}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

module.exports = router;
