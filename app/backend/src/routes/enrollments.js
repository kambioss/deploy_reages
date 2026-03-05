const express = require('express');
const database = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

async function ensureTable() {
  await database.query(`CREATE TABLE IF NOT EXISTS enrollments_reaagess (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, cours_id UUID, status TEXT DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW())`);
}

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try { await ensureTable(); const r = await database.query('SELECT * FROM enrollments_reaagess ORDER BY created_at DESC'); res.json({success:true,enrollments:r.rows,data:r.rows}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});
router.post('/', authenticate, async (req, res) => {
  try { await ensureTable(); const { cours_id } = req.body; const r = await database.query('INSERT INTO enrollments_reaagess (user_id,cours_id) VALUES ($1,$2) RETURNING *',[req.user.userId,cours_id]); res.status(201).json({success:true,enrollment:r.rows[0]}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await ensureTable(); const { status } = req.body; const r = await database.query('UPDATE enrollments_reaagess SET status=$1 WHERE id=$2 RETURNING *',[status,req.params.id]); res.json({success:true,enrollment:r.rows[0]}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await ensureTable(); await database.query('DELETE FROM enrollments_reaagess WHERE id=$1',[req.params.id]); res.json({success:true}); } catch(err) { res.status(500).json({error:'Erreur serveur'}); }
});

module.exports = router;
