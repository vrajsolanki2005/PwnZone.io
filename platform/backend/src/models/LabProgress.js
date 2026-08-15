const pool = require('../config/db');

const LabProgress = {
  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_lab_progress WHERE user_id = ?',
      [userId]
    );
    return rows;
  },

  async findOne(userId, labId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_lab_progress WHERE user_id = ? AND lab_id = ?',
      [userId, labId]
    );
    return rows[0] || null;
  },

  async startLab(userId, labId) {
    await pool.query(
      `INSERT INTO user_lab_progress (user_id, lab_id, status, started_at, last_accessed_at, attempts)
       VALUES (?, ?, 'IN_PROGRESS', NOW(), NOW(), 1) AS new_row
       ON DUPLICATE KEY UPDATE
         status           = IF(status = 'COMPLETED', status, 'IN_PROGRESS'),
         started_at       = IF(started_at IS NULL, NOW(), started_at),
         last_accessed_at = NOW(),
         attempts         = attempts + 1,
         updated_at       = NOW()`,
      [userId, labId]
    );
  },

  async complete(userId, labId, points) {
    await pool.query(
      `INSERT INTO user_lab_progress (user_id, lab_id, status, points_earned, completed_at)
       VALUES (?, ?, 'COMPLETED', ?, NOW()) AS new_row
       ON DUPLICATE KEY UPDATE
         status        = IF(status = 'COMPLETED', status, 'COMPLETED'),
         points_earned = IF(status = 'COMPLETED', points_earned, new_row.points_earned),
         completed_at  = IF(status = 'COMPLETED', completed_at, NOW()),
         updated_at    = NOW()`,
      [userId, labId, points]
    );
  },

  async getStats(userId) {
    const [rows] = await pool.query(
      `SELECT
         COUNT(*)                                        AS total_completed,
         COALESCE(SUM(points_earned), 0)                AS total_points,
         COUNT(CASE WHEN l.difficulty = 'P1' THEN 1 END) AS p1_completed,
         COUNT(CASE WHEN l.difficulty = 'P2' THEN 1 END) AS p2_completed,
         COUNT(CASE WHEN l.difficulty = 'P3' THEN 1 END) AS p3_completed,
         COUNT(CASE WHEN l.difficulty = 'P4' THEN 1 END) AS p4_completed
       FROM user_lab_progress ulp
       JOIN labs l ON l.id = ulp.lab_id
       WHERE ulp.user_id = ? AND ulp.status = 'COMPLETED'`,
      [userId]
    );
    return rows[0];
  },

  async getRecentCompletions(userId, limit = 5) {
    const [rows] = await pool.query(
      `SELECT ulp.completed_at, ulp.points_earned, l.title, l.difficulty, l.slug
       FROM user_lab_progress ulp
       JOIN labs l ON l.id = ulp.lab_id
       WHERE ulp.user_id = ? AND ulp.status = 'COMPLETED'
       ORDER BY ulp.completed_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },

  async getProgressMap(userId) {
    const [rows] = await pool.query(
      `SELECT lab_id, status FROM user_lab_progress WHERE user_id = ?`,
      [userId]
    );
    return Object.fromEntries(rows.map(r => [r.lab_id, r.status]));
  },
};

module.exports = LabProgress;
