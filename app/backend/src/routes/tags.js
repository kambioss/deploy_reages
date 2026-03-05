const express = require('express');
const database = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { limit = 50, search } = req.query;
    
    let query = `
      SELECT t.* 
      FROM tags t
      WHERE 1=1
    `;
    
    const values = [];
    let paramIndex = 1;
    
    if (search) {
      query += ` AND t.name ILIKE $${paramIndex++}`;
      values.push(`%${search}%`);
    }
    
    query += ` ORDER BY t.usage_count DESC, t.name ASC LIMIT $${paramIndex++}`;
    values.push(parseInt(limit));
    
    const result = await database.query(query, values);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting tags:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tags',
      message: 'Internal server error'
    });
  }
});

// Get tag by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM tags WHERE id = $1';
    const result = await database.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tag not found',
        message: 'Tag with the specified ID does not exist'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error getting tag by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tag',
      message: 'Internal server error'
    });
  }
});

// Get tag by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const query = 'SELECT * FROM tags WHERE slug = $1';
    const result = await database.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tag not found',
        message: 'Tag with the specified slug does not exist'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error getting tag by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tag',
      message: 'Internal server error'
    });
  }
});

// Get popular tags
router.get('/popular/top', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const query = `
      SELECT * FROM tags 
      WHERE usage_count > 0 
      ORDER BY usage_count DESC, name ASC 
      LIMIT $1
    `;
    
    const result = await database.query(query, [parseInt(limit)]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting popular tags:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get popular tags',
      message: 'Internal server error'
    });
  }
});

module.exports = router;