const express = require('express');
const ArticleController = require('../controllers/ArticleController');
const { validateArticle } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', ArticleController.getArticles);
router.get('/recent', ArticleController.getRecentArticles);
router.get('/featured', ArticleController.getFeaturedArticles);
router.get('/search', ArticleController.searchArticles);
router.get('/stats', ArticleController.getArticleStats);
router.get('/:id', ArticleController.getArticleById);
router.get('/slug/:slug', ArticleController.getArticleBySlug);

// Protected routes (require authentication)
router.post('/', validateArticle, ArticleController.createArticle);
router.put('/:id', validateArticle, ArticleController.updateArticle);
router.delete('/:id', ArticleController.deleteArticle);
router.post('/:id/like', ArticleController.toggleLike);

module.exports = router;