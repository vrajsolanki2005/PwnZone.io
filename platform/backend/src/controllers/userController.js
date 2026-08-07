const bcrypt = require('bcryptjs');
const pool   = require('../config/db');
const User   = require('../models/User');

const LEVEL_THRESHOLDS = [0, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000];
const LEVEL_TITLES     = ['Rookie','Script Kiddie','Apprentice','Explorer','Hacker','Senior Hacker','Elite Hacker','Master Hacker','Legend','God Mode'];

function getLevel(points) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1; else break;
  }
  return level;
}

// Returns today's date as YYYY-MM-DD in IST
function todayIST() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [userRows] = await pool.query(
      'SELECT id, name, email, avatar, bio, location, github, twitter, provider, created_at FROM users WHERE id = ?',
      [userId]
    );
    const user = userRows[0];
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const [statsRows] = await pool.query(
      `SELECT
         COALESCE(SUM(ulp.points_earned), 0)              AS total_points,
         COUNT(ulp.id)                                     AS total_completed,
         COUNT(CASE WHEN l.difficulty='P1' THEN 1 END)    AS p1_completed,
         COUNT(CASE WHEN l.difficulty='P2' THEN 1 END)    AS p2_completed,
         COUNT(CASE WHEN l.difficulty='P3' THEN 1 END)    AS p3_completed,
         COUNT(CASE WHEN l.difficulty='P4' THEN 1 END)    AS p4_completed
       FROM user_lab_progress ulp
       JOIN labs l ON l.id = ulp.lab_id
       WHERE ulp.user_id = ? AND ulp.status = 'COMPLETED'`,
      [userId]
    );
    const stats = statsRows[0] || { total_points: 0, total_completed: 0, p1_completed: 0, p2_completed: 0, p3_completed: 0, p4_completed: 0 };

    const [labTotalsRows] = await pool.query(
      `SELECT
         COUNT(CASE WHEN difficulty='P1' THEN 1 END) AS p1_total,
         COUNT(CASE WHEN difficulty='P2' THEN 1 END) AS p2_total,
         COUNT(CASE WHEN difficulty='P3' THEN 1 END) AS p3_total,
         COUNT(CASE WHEN difficulty='P4' THEN 1 END) AS p4_total
       FROM labs`
    );
    const labTotals = labTotalsRows[0] || { p1_total: 0, p2_total: 0, p3_total: 0, p4_total: 0 };

    const [streakRows] = await pool.query(
      `SELECT current_streak, max_streak, last_activity_date FROM users WHERE id = ?`,
      [userId]
    );
    const streakRow = streakRows[0] || { current_streak: 0, max_streak: 0 };

    // Recalculate streak live from user_lab_progress — source of truth
    const today     = todayIST();
    const yesterday = new Date(Date.now() + 5.5 * 60 * 60 * 1000 - 86400000).toISOString().slice(0, 10);
    const lastDate  = streakRow.last_activity_date
      ? new Date(new Date(streakRow.last_activity_date).getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10)
      : null;
    const streakActive   = lastDate === today || lastDate === yesterday;
    const current_streak = streakActive ? Number(streakRow.current_streak) : 0;

    const [rankRows] = await pool.query(
      `SELECT COUNT(*) + 1 AS user_rank FROM (
         SELECT user_id, SUM(points_earned) AS pts
         FROM user_lab_progress WHERE status = 'COMPLETED'
         GROUP BY user_id
       ) t WHERE pts > ?`,
      [Number(stats.total_points)]
    );
    const rank = rankRows[0]?.user_rank || 1;

    const [recent] = await pool.query(
      `SELECT l.slug, l.title, l.difficulty, ulp.points_earned, ulp.completed_at
       FROM user_lab_progress ulp
       JOIN labs l ON l.id = ulp.lab_id
       WHERE ulp.user_id = ? AND ulp.status = 'COMPLETED'
       ORDER BY ulp.completed_at DESC LIMIT 10`,
      [userId]
    );

    // Use DATE_FORMAT with IST offset to get plain YYYY-MM-DD strings directly — no JS Date conversion needed
    const [activity] = await pool.query(
      `SELECT
         DATE_FORMAT(DATE_ADD(completed_at, INTERVAL 330 MINUTE), '%Y-%m-%d') AS date,
         COUNT(*) AS count
       FROM user_lab_progress
       WHERE user_id = ? AND status = 'COMPLETED'
       GROUP BY DATE_FORMAT(DATE_ADD(completed_at, INTERVAL 330 MINUTE), '%Y-%m-%d')
       ORDER BY date ASC`,
      [userId]
    );

    // activity rows now have plain string dates — no conversion needed
    const activityClean = activity.map(a => ({ date: a.date, count: Number(a.count) }));

    const points = Number(stats.total_points);
    const level  = getLevel(points);

    res.json({
      user: {
        ...user,
        joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      },
      stats: {
        total_points:    points,
        total_completed: Number(stats.total_completed),
        current_streak,
        max_streak:      Number(streakRow.max_streak),
        rank,
        level,
        level_title:  LEVEL_TITLES[level - 1] || 'God Mode',
        next_title:   LEVEL_TITLES[level]     || 'MAX',
        level_start:  LEVEL_THRESHOLDS[level - 1] || 0,
        level_end:    LEVEL_THRESHOLDS[level]     || 20000,
        by_priority: [
          { key: 'P1', label: '🔴 Critical', completed: Number(stats.p1_completed), total: Number(labTotals.p1_total), color: '#ef4444' },
          { key: 'P2', label: '🟠 High',     completed: Number(stats.p2_completed), total: Number(labTotals.p2_total), color: '#FF9F43' },
          { key: 'P3', label: '🟡 Medium',   completed: Number(stats.p3_completed), total: Number(labTotals.p3_total), color: '#eab308' },
          { key: 'P4', label: '🟢 Low',      completed: Number(stats.p4_completed), total: Number(labTotals.p4_total), color: '#22C55E' },
        ],
      },
      recent,
      activity: activityClean,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/phone
const updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required.' });
    const PHONE_RE = /^\+?[1-9]\d{6,14}$/;
    if (!PHONE_RE.test(phone)) return res.status(400).json({ message: 'Invalid phone number.' });
    await pool.query('UPDATE users SET phone = ? WHERE id = ?', [phone, req.user.id]);
    res.json({ message: 'Phone number saved.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, github, twitter } = req.body;
    await pool.query(
      'UPDATE users SET name = ?, bio = ?, location = ?, github = ?, twitter = ? WHERE id = ?',
      [name, bio || null, location || null, github || null, twitter || null, req.user.id]
    );
    res.json({ message: 'Profile updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both fields are required.' });

    const user = await User.findById(req.user.id);
    if (!user.password)
      return res.status(400).json({ message: 'Password change not available for OAuth accounts.' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect.' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/progress
const resetProgress = async (req, res) => {
  try {
    await pool.query('DELETE FROM user_lab_progress WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Progress reset.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/account
const deleteAccount = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Account deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, updatePhone, changePassword, resetProgress, deleteAccount };
