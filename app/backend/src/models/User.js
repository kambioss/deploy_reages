const database = require('../config/database');
const logger = require('../utils/logger');

class User {
  static async findByKeycloakId(keycloakId) {
    try {
      const query = `
        SELECT id, keycloak_id, email, first_name, last_name, phone, country, 
               function, sector, organization, bio, avatar_url, is_active, 
               is_verified, role, created_at, updated_at, last_login
        FROM users 
        WHERE keycloak_id = $1
      `;
      const result = await database.query(query, [keycloakId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by Keycloak ID:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = `
        SELECT id, keycloak_id, email, first_name, last_name, phone, country, 
               function, sector, organization, bio, avatar_url, is_active, 
               is_verified, role, created_at, updated_at, last_login
        FROM users 
        WHERE email = $1
      `;
      const result = await database.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT id, keycloak_id, email, first_name, last_name, phone, country, 
               function, sector, organization, bio, avatar_url, is_active, 
               is_verified, role, created_at, updated_at, last_login
        FROM users 
        WHERE id = $1
      `;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const {
        keycloak_id,
        email,
        first_name,
        last_name,
        phone,
        country,
        function: userFunction,
        sector,
        organization,
        bio,
        avatar_url,
        role = 'member'
      } = userData;

      const query = `
        INSERT INTO users (
          keycloak_id, email, first_name, last_name, phone, country, 
          function, sector, organization, bio, avatar_url, role
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, keycloak_id, email, first_name, last_name, phone, country, 
                 function, sector, organization, bio, avatar_url, is_active, 
                 is_verified, role, created_at, updated_at
      `;

      const values = [
        keycloak_id,
        email,
        first_name,
        last_name,
        phone,
        country,
        userFunction,
        sector,
        organization,
        bio,
        avatar_url,
        role
      ];

      const result = await database.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const {
        first_name,
        last_name,
        phone,
        country,
        function: userFunction,
        sector,
        organization,
        bio,
        avatar_url,
        is_active,
        is_verified,
        role
      } = userData;

      const query = `
        UPDATE users 
        SET first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            phone = COALESCE($3, phone),
            country = COALESCE($4, country),
            function = COALESCE($5, function),
            sector = COALESCE($6, sector),
            organization = COALESCE($7, organization),
            bio = COALESCE($8, bio),
            avatar_url = COALESCE($9, avatar_url),
            is_active = COALESCE($10, is_active),
            is_verified = COALESCE($11, is_verified),
            role = COALESCE($12, role),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $13
        RETURNING id, keycloak_id, email, first_name, last_name, phone, country, 
                 function, sector, organization, bio, avatar_url, is_active, 
                 is_verified, role, created_at, updated_at
      `;

      const values = [
        first_name,
        last_name,
        phone,
        country,
        userFunction,
        sector,
        organization,
        bio,
        avatar_url,
        is_active,
        is_verified,
        role,
        id
      ];

      const result = await database.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  static async updateLastLogin(id) {
    try {
      const query = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, last_login
      `;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error updating last login:', error);
      throw error;
    }
  }

  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        country,
        sector,
        role,
        is_active,
        search
      } = options;

      let query = `
        SELECT id, keycloak_id, email, first_name, last_name, phone, country, 
               function, sector, organization, bio, avatar_url, is_active, 
               is_verified, role, created_at, updated_at, last_login
        FROM users 
        WHERE 1=1
      `;
      
      const values = [];
      let paramIndex = 1;

      if (country) {
        query += ` AND country = $${paramIndex++}`;
        values.push(country);
      }

      if (sector) {
        query += ` AND sector = $${paramIndex++}`;
        values.push(sector);
      }

      if (role) {
        query += ` AND role = $${paramIndex++}`;
        values.push(role);
      }

      if (is_active !== undefined) {
        query += ` AND is_active = $${paramIndex++}`;
        values.push(is_active);
      }

      if (search) {
        query += ` AND (first_name ILIKE $${paramIndex++} OR last_name ILIKE $${paramIndex++} OR email ILIKE $${paramIndex++} OR organization ILIKE $${paramIndex++})`;
        values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Count total records
      const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) FROM').replace(/ORDER BY.*$/, '');
      const countResult = await database.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count);

      // Add ordering and pagination
      query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      values.push(limit, (page - 1) * limit);

      const result = await database.query(query, values);

      return {
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error finding users:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
          COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_users,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
          COUNT(CASE WHEN role = 'moderator' THEN 1 END) as moderator_users,
          COUNT(CASE WHEN role = 'member' THEN 1 END) as member_users,
          COUNT(DISTINCT country) as countries_count,
          COUNT(DISTINCT sector) as sectors_count
        FROM users
      `;
      const result = await database.query(query);
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw error;
    }
  }
}

module.exports = User;