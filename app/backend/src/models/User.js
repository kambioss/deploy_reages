const database = require('../config/database');
const logger = require('../utils/logger');

class User {
  static async findByEmail(email) {
    const { rows } = await database.query(
      `SELECT id, email, password_hash, first_name, last_name, phone, country,
              function, sector, organization, bio, avatar_url,
              is_active, role, created_at, updated_at, last_login
       FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await database.query(
      `SELECT id, email, first_name, last_name, phone, country,
              function, sector, organization, bio, avatar_url,
              is_active, role, created_at, updated_at, last_login
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  static async create(userData) {
    const {
      email, password_hash, first_name, last_name,
      phone = null, country = null, function: fn = null,
      sector = null, organization = null, bio = null,
      avatar_url = null, role = 'member'
    } = userData;

    const { rows } = await database.query(
      `INSERT INTO users
         (email, password_hash, first_name, last_name, phone, country, function,
          sector, organization, bio, avatar_url, role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id, email, first_name, last_name, phone, country, function,
                 sector, organization, bio, avatar_url, is_active, role, created_at`,
      [email, password_hash, first_name, last_name, phone, country, fn,
       sector, organization, bio, avatar_url, role]
    );
    return rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    const allowed = ['first_name','last_name','phone','country','function',
                     'sector','organization','bio','avatar_url','is_active','role'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i++}`);
        values.push(data[key]);
      }
    }
    if (data.password_hash) {
      fields.push(`password_hash = $${i++}`);
      values.push(data.password_hash);
    }

    if (fields.length === 0) return User.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const { rows } = await database.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${i}
       RETURNING id, email, first_name, last_name, phone, country, function,
                 sector, organization, bio, avatar_url, is_active, role, updated_at`,
      values
    );
    return rows[0] || null;
  }

  static async updateLastLogin(id) {
    await database.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [id]
    );
  }

  static async findAll(options = {}) {
    const { page = 1, limit = 10, country, sector, role, is_active, search } = options;
    const conds = ['1=1'];
    const vals = [];
    let idx = 1;

    if (country) { conds.push(`country = $${idx++}`); vals.push(country); }
    if (sector)  { conds.push(`sector = $${idx++}`);  vals.push(sector); }
    if (role)    { conds.push(`role = $${idx++}`);    vals.push(role); }
    if (is_active !== undefined) { conds.push(`is_active = $${idx++}`); vals.push(is_active); }
    if (search) {
      conds.push(`(first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR email ILIKE $${idx})`);
      vals.push(`%${search}%`); idx++;
    }

    const where = conds.join(' AND ');
    const countRes = await database.query(
      `SELECT COUNT(*) FROM users WHERE ${where}`, vals
    );
    const total = parseInt(countRes.rows[0].count);

    vals.push(limit, (page - 1) * limit);
    const { rows } = await database.query(
      `SELECT id, email, first_name, last_name, phone, country, function,
              sector, organization, bio, avatar_url, is_active, role,
              created_at, last_login
       FROM users WHERE ${where}
       ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      vals
    );

    return { users: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  static async delete(id) {
    const { rows } = await database.query(
      'DELETE FROM users WHERE id = $1 RETURNING id', [id]
    );
    return rows[0] || null;
  }

  static async count() {
    const { rows } = await database.query('SELECT COUNT(*) FROM users');
    return parseInt(rows[0].count);
  }

  static async existsByEmail(email) {
    const { rows } = await database.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    return rows.length > 0;
  }
}

module.exports = User;
