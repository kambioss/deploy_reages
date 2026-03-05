const Article = require('../models/Article');
const logger = require('../utils/logger');

class ArticleController {
  // Get all articles with pagination and filtering
  static async getArticles(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category_id,
        author_id,
        featured,
        search,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        category_id,
        author_id,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        search,
        sort_by,
        sort_order
      };

      const result = await Article.findAll(options);

      res.json({
        success: true,
        data: result.articles,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error getting articles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get articles',
        message: 'Internal server error'
      });
    }
  }

  // Get single article by ID
  static async getArticleById(req, res) {
    try {
      const { id } = req.params;
      
      const article = await Article.findById(id);
      
      if (!article) {
        return res.status(404).json({
          success: false,
          error: 'Article not found',
          message: 'Article with the specified ID does not exist'
        });
      }

      // Increment view count
      await Article.incrementViewCount(id);

      res.json({
        success: true,
        data: article
      });
    } catch (error) {
      logger.error('Error getting article by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get article',
        message: 'Internal server error'
      });
    }
  }

  // Get single article by slug
  static async getArticleBySlug(req, res) {
    try {
      const { slug } = req.params;
      
      const article = await Article.findBySlug(slug);
      
      if (!article) {
        return res.status(404).json({
          success: false,
          error: 'Article not found',
          message: 'Article with the specified slug does not exist'
        });
      }

      // Increment view count
      await Article.incrementViewCount(article.id);

      res.json({
        success: true,
        data: article
      });
    } catch (error) {
      logger.error('Error getting article by slug:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get article',
        message: 'Internal server error'
      });
    }
  }

  // Create new article
  static async createArticle(req, res) {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category_id,
        status = 'draft',
        featured = false
      } = req.body;

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Title and content are required'
        });
      }

      // Get author ID from authenticated user
      const user = await require('../models/User').findById(req.user.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          message: 'Authenticated user not found in database'
        });
      }

      const articleData = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        excerpt,
        content,
        featured_image,
        author_id: user.id,
        category_id,
        status,
        featured,
        published_at: status === 'published' ? new Date() : null
      };

      const article = await Article.create(articleData);

      res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: article
      });
    } catch (error) {
      logger.error('Error creating article:', error);
      
      // Handle duplicate slug error
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'Duplicate slug',
          message: 'An article with this slug already exists'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create article',
        message: 'Internal server error'
      });
    }
  }

  // Update article
  static async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category_id,
        status,
        featured
      } = req.body;

      // Check if article exists
      const existingArticle = await Article.findById(id);
      if (!existingArticle) {
        return res.status(404).json({
          success: false,
          error: 'Article not found',
          message: 'Article with the specified ID does not exist'
        });
      }

      // Check if user is the author or admin
      const user = await require('../models/User').findById(req.user.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          message: 'Authenticated user not found in database'
        });
      }

      // Check permissions (author or admin)
      if (existingArticle.author_id !== user.id && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Permission denied',
          message: 'You can only edit your own articles'
        });
      }

      const articleData = {
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category_id,
        status,
        featured,
        published_at: status === 'published' && !existingArticle.published_at ? new Date() : existingArticle.published_at
      };

      const article = await Article.update(id, articleData);

      res.json({
        success: true,
        message: 'Article updated successfully',
        data: article
      });
    } catch (error) {
      logger.error('Error updating article:', error);
      
      // Handle duplicate slug error
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          error: 'Duplicate slug',
          message: 'An article with this slug already exists'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update article',
        message: 'Internal server error'
      });
    }
  }

  // Delete article
  static async deleteArticle(req, res) {
    try {
      const { id } = req.params;

      // Check if article exists
      const existingArticle = await Article.findById(id);
      if (!existingArticle) {
        return res.status(404).json({
          success: false,
          error: 'Article not found',
          message: 'Article with the specified ID does not exist'
        });
      }

      // Check if user is the author or admin
      const user = await require('../models/User').findById(req.user.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          message: 'Authenticated user not found in database'
        });
      }

      // Check permissions (author or admin)
      if (existingArticle.author_id !== user.id && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Permission denied',
          message: 'You can only delete your own articles'
        });
      }

      const deletedArticle = await Article.delete(id);

      res.json({
        success: true,
        message: 'Article deleted successfully',
        data: deletedArticle
      });
    } catch (error) {
      logger.error('Error deleting article:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete article',
        message: 'Internal server error'
      });
    }
  }

  // Like/unlike article
  static async toggleLike(req, res) {
    try {
      const { id } = req.params;

      // Check if article exists
      const article = await Article.findById(id);
      if (!article) {
        return res.status(404).json({
          success: false,
          error: 'Article not found',
          message: 'Article with the specified ID does not exist'
        });
      }

      // This is a simplified implementation
      // In a real app, you'd track which users liked which articles
      const updatedArticle = await Article.incrementLikeCount(id);

      res.json({
        success: true,
        message: 'Article liked successfully',
        data: {
          like_count: updatedArticle.like_count
        }
      });
    } catch (error) {
      logger.error('Error toggling like:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle like',
        message: 'Internal server error'
      });
    }
  }

  // Get recent articles
  static async getRecentArticles(req, res) {
    try {
      const { limit = 5 } = req.query;
      
      const articles = await Article.getRecentArticles(parseInt(limit));

      res.json({
        success: true,
        data: articles
      });
    } catch (error) {
      logger.error('Error getting recent articles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recent articles',
        message: 'Internal server error'
      });
    }
  }

  // Get featured articles
  static async getFeaturedArticles(req, res) {
    try {
      const { limit = 3 } = req.query;
      
      const articles = await Article.getFeaturedArticles(parseInt(limit));

      res.json({
        success: true,
        data: articles
      });
    } catch (error) {
      logger.error('Error getting featured articles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get featured articles',
        message: 'Internal server error'
      });
    }
  }

  // Search articles
  static async searchArticles(req, res) {
    try {
      const { q, limit = 10, offset = 0 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Missing search query',
          message: 'Search query parameter "q" is required'
        });
      }

      const articles = await Article.searchArticles(q, parseInt(limit), parseInt(offset));

      res.json({
        success: true,
        data: articles,
        query: q
      });
    } catch (error) {
      logger.error('Error searching articles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search articles',
        message: 'Internal server error'
      });
    }
  }

  // Get article statistics
  static async getArticleStats(req, res) {
    try {
      const stats = await Article.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error getting article stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get article statistics',
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ArticleController;