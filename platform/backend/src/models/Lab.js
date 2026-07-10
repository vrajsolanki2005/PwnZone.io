const pool = require('../config/db');

const Lab = {
  async findAll({ difficulty, category, search, sort } = {}) {
    let q = 'SELECT * FROM labs WHERE 1=1';
    const params = [];
    if (difficulty) { q += ' AND difficulty = ?'; params.push(difficulty); }
    if (category)   { q += ' AND category = ?';   params.push(category); }
    if (search)     { q += ' AND (title LIKE ? OR category LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const sortMap = {
      'points-desc':  'points DESC',
      'points-asc':   'points ASC',
      'title-asc':    'title ASC',
      'title-desc':   'title DESC',
      'newest':       'created_at DESC',
      'oldest':       'created_at ASC',
    };
    q += ` ORDER BY ${sortMap[sort] || 'difficulty, id'}`;

    const [rows] = await pool.query(q, params);
    return rows;
  },

  async findBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM labs WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async findFlag(slug) {
    const [rows] = await pool.query('SELECT id, flag, points FROM labs WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM labs WHERE id = ?', [id]);
    return rows[0] || null;
  },
};

module.exports = Lab;
