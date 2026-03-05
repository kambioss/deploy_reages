const database = require('../config/database');
const logger = require('../utils/logger');

class Article {
  static async findById(id) {
    try {
      const query = `
        SELECT a.*, 
               u.first_name || ' ' || u.last_name as author_name,
               u.email as author_email,
               c.name as category_name,
               c.slug as category_slug,
               c.color as category_color
        FROM articles a
        JOIN users u ON a.author_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.id = $1
      `;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding article by ID:', error);
      throw error;
    }
  }

  static async findBySlug(slug) {
    try {
      const query = `
        SELECT a.*, 
               u.first_name || ' ' || u.last_name as author_name,
               u.email as author_email,
               c.name as category_name,
               c.slug as category_slug,
               c.color as category_color
        FROM articles a
        JOIN users u ON a.author_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.slug = $1
      `;
      const result = await database.query(query, [slug]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding article by slug:', error);
      throw error;
    }
  }

  static async create(articleData) {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        featured_image,
        author_id,
        category_id,
        status = 'draft',
        featured = false,
        published_at
      } = articleData;

      const query = `
        INSERT INTO articles (
          title, slug, excerpt, content, featured_image, author_id, 
          category_id, status, featured, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        title,
        slug,
        excerpt,
        content,
        featured_image,
        author_id,
        category_id,
        status,
        featured,
        published_at
      ];

      const result = await database.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating article:', error);
      throw error;
    }
  }

  static async update(id, articleData) {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category_id,
        status,
        featured,
        published_at
      } = articleData;

      const query = `
        UPDATE articles 
        SET title = COALESCE($1, title),
            slug = COALESCE($2, slug),
            excerpt = COALESCE($3, excerpt),
            content = COALESCE($4, content),
            featured_image = COALESCE($5, featured_image),
            category_id = COALESCE($6, category_id),
            status = COALESCE($7, status),
            featured = COALESCE($8, featured),
            published_at = COALESCE($9, published_at),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;

      const values = [
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category_id,
        status,
        featured,
        published_at,
        id
      ];

      const result = await database.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error updating article:', error);
      throw error;
    }
  }

  static async findAll(options = {}) {
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
      } = options;

      let query = `
        SELECT a.*, 
               u.first_name || ' ' || u.last_name as author_name,
               u.email as author_email,
               c.name as category_name,
               c.slug as category_slug,
               c.color as category_color
        FROM articles a
        JOIN users u ON a.author_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE 1=1
      `;
      
      const values = [];
      let paramIndex = 1;

      if (status) {
        query += ` AND a.status = $${paramIndex++}`;
        values.push(status);
      }

      if (category_id) {
        query += ` AND a.category_id = $${paramIndex++}`;
        values.push(category_id);
      }

      if (author_id) {
        query += ` AND a.author_id = $${paramIndex++}`;
        values.push(author_id);
      }

      if (featured !== undefined) {
        query += ` AND a.featured = $${paramIndex++}`;
        values.push(featured);
      }

      if (search) {
        query += ` AND (a.title ILIKE $${paramIndex++} OR a.excerpt ILIKE $${paramIndex++} OR a.content ILIKE $${paramIndex++})`;
        values.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Count total records
      const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) FROM').replace(/ORDER BY.*$/, '');
      const countResult = await database.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count);

      // Add ordering and pagination
      const validSortFields = ['created_at', 'updated_at', 'published_at', 'title', 'view_count', 'like_count'];
      const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
      const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY a.${sortField} ${sortDirection} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      values.push(limit, (page - 1) * limit);

      const result = await database.query(query, values);

      return {
        articles: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error finding articles:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM articles WHERE id = $1 RETURNING id';
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error deleting article:', error);
      throw error;
    }
  }

  static async incrementViewCount(id) {
    try {
      const query = `
        UPDATE articles 
        SET view_count = view_count + 1
        WHERE id = $1
        RETURNING view_count
      `;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error incrementing view count:', error);
      throw error;
    }
  }

  static async incrementLikeCount(id) {
    try {
      const query = `
        UPDATE articles 
        SET like_count = like_count + 1
        WHERE id = $1
        RETURNING like_count
      `;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error incrementing like count:', error);
      throw error;
    }
  }

  static async decrementLikeCount(id) {
    try {
      const query = `
        UPDATE articles 
        SET like_count = GREATEST(like_count - 1, 0)
        WHERE id = $1
        RETURNING like_count
      `;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error decrementing like count:', error);
      throw error;
    }
  }

  static async getRecentArticles(limit = 5) {
    try {
      const query = `
        SELECT a.*, 
               u.first_name || ' ' || u.last_name as author_name,
               c.name as category_name,
               c.color as category_color
        FROM articles a
        JOIN users u ON a.author_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.status = 'published'
        ORDER BY a.published_at DESC
        LIMIT $1
      `;
      const result = await database.query(query, [limit]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting recent articles:', error);
      throw error;
    }
  }

  static async getFeaturedArticles(limit = 3) {
    try {
      const query = `
        SELECT a.*, 
               u.first_name || ' ' || u.last_name as author_name,
               c.name as category_name,
               c.color as category_color
        FROM articles a
        JOIN users u ON a.author_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.status = 'published' AND a.featured = true
        ORDER BY a.published_at DESC
        LIMIT $1
      `;
      const result = await database.query(query, [limit]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting featured articles:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_articles,
          COUNT(CASE WHEN status = 'published' THEN 1 END) as published_articles,
          COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_articles,
          COUNT(CASE WHEN featured = true THEN 1 END) as featured_articles,
          SUM(view_count) as total_views,
          SUM(like_count) as total_likes,
          SUM(comment_count) as total_comments
        FROM articles
      `;
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting article stats:', error);
      throw error;
    }
  }

  static async searchArticles(searchQuery, limit = 10, offset = 0) {
    try {
      const query = `
        SELECT * FROM search_articles($1, $2, $3)
      `;
      const result = await database.query(query, [searchQuery, limit, offset]);
      return result.rows;
    } catch (error) {
      logger.error('Error searching articles:', error);
      throw error;
    }
  }
}

module.exports = Article;