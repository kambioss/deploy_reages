const express = require('express');
const database = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM articles WHERE category_id = c.id AND status = 'published') as article_count,
             (SELECT COUNT(*) FROM events WHERE category_id = c.id AND status = 'upcoming') as event_count,
             (SELECT COUNT(*) FROM projects WHERE category_id = c.id AND status = 'active') as project_count
      FROM categories c
      WHERE c.is_active = true
      ORDER BY c.sort_order ASC, c.name ASC
    `;
    
    const result = await database.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get categories',
      message: 'Internal server error'
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM articles WHERE category_id = c.id AND status = 'published') as article_count,
             (SELECT COUNT(*) FROM events WHERE category_id = c.id AND status = 'upcoming') as event_count,
             (SELECT COUNT(*) FROM projects WHERE category_id = c.id AND status = 'active') as project_count
      FROM categories c
      WHERE c.id = $1 AND c.is_active = true
    `;
    
    const result = await database.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: 'Category with the specified ID does not exist'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error getting category by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get category',
      message: 'Internal server error'
    });
  }
});

// Get category by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM articles WHERE category_id = c.id AND status = 'published') as article_count,
             (SELECT COUNT(*) FROM events WHERE category_id = c.id AND status = 'upcoming') as event_count,
             (SELECT COUNT(*) FROM projects WHERE category_id = c.id AND status = 'active') as project_count
      FROM categories c
      WHERE c.slug = $1 AND c.is_active = true
    `;
    
    const result = await database.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: 'Category with the specified slug does not exist'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error getting category by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get category',
      message: 'Internal server error'
    });
  }
});

module.exports = router;