const pool = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByGoogleId(googleId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
    return rows[0] || null;
  },

  async incrementTokenVersion(id) {
    await pool.query('UPDATE users SET token_version = token_version + 1 WHERE id = ?', [id]);
  },

  async updateStreak(id, currentStreak, maxStreak, lastActivityDate) {
    await pool.query(
      'UPDATE users SET current_streak = ?, max_streak = ?, last_activity_date = ? WHERE id = ?',
      [currentStreak, maxStreak, lastActivityDate, id]
    );
  },

  async create({ name, email, password, avatar, google_id, provider }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, avatar, google_id, provider) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password || null, avatar || null, google_id || null, provider || 'local']
    );
    return { id: result.insertId, name, email, avatar, provider };
  },
};

module.exports = User;
