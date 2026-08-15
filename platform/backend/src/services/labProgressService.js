const crypto = require('crypto');
const pool = require('../config/db');
const LabProgress = require('../models/LabProgress');
const Lab = require('../models/Lab');

const IST = 5.5 * 60 * 60 * 1000;

function todayIST()     { return new Date(Date.now() + IST).toISOString().slice(0, 10); }
function yesterdayIST() { return new Date(Date.now() + IST - 86400000).toISOString().slice(0, 10); }

// Convert a stored DATE value (JS Date object or string) to YYYY-MM-DD in IST
function toISTStr(val) {
  if (!val) return null;
  const d = val instanceof Date ? val : new Date(val);
  return new Date(d.getTime() + IST).toISOString().slice(0, 10);
}

async function updateStreak(userId) {
  const [[user]] = await pool.query(
    `SELECT current_streak, max_streak, last_activity_date FROM users WHERE id = ?`,
    [userId]
  );
  if (!user) return;

  const today     = todayIST();
  const yesterday = yesterdayIST();
  const lastDate  = toISTStr(user.last_activity_date);

  if (lastDate === today) return; // already updated today in IST

  const current = lastDate === yesterday ? (user.current_streak || 0) + 1 : 1;
  const newMax  = Math.max(current, user.max_streak || 0);

  // Store today's IST date — MySQL DATE column accepts YYYY-MM-DD string
  await pool.query(
    `UPDATE users SET current_streak = ?, max_streak = ?, last_activity_date = ? WHERE id = ?`,
    [current, newMax, today, userId]
  );
}

const HINT_PENALTY = 10;

const createSession = async (userId, slug) => {
  const lab = await Lab.findBySlug(slug);
  if (!lab) { const e = new Error('Lab not found.'); e.status = 404; throw e; }

  const existing = await LabProgress.findOne(userId, lab.id);
  if (existing?.status === 'COMPLETED')
    return { lab_url: lab.lab_url, session_id: null, alreadyCompleted: true };

  await LabProgress.startLab(userId, lab.id);

  const sessionId = crypto.randomBytes(32).toString('hex');
  await pool.query(
    `INSERT INTO lab_sessions (id, user_id, lab_id, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 4 HOUR))
     ON DUPLICATE KEY UPDATE id = id`,
    [sessionId, userId, lab.id]
  );

  return { lab_url: lab.lab_url, session_id: sessionId, alreadyCompleted: false };
};

const unlockHint = async (userId, slug) => {
  const record = await Lab.findFlag(slug);
  if (!record) { const e = new Error('Lab not found.'); e.status = 404; throw e; }

  const existing = await LabProgress.findOne(userId, record.id);
  if (existing?.status === 'COMPLETED') return { hints_used: existing.hints_used };

  if (existing) {
    await pool.query(
      `UPDATE user_lab_progress SET hints_used = hints_used + 1 WHERE user_id = ? AND lab_id = ?`,
      [userId, record.id]
    );
    return { hints_used: existing.hints_used + 1 };
  }

  await pool.query(
    `INSERT INTO user_lab_progress (user_id, lab_id, status, hints_used) VALUES (?, ?, 'PENDING', 1)
     ON DUPLICATE KEY UPDATE hints_used = hints_used + 1`,
    [userId, record.id]
  );
  return { hints_used: 1 };
};

const completeLab = async (userId, labId) => {
  const lab = await Lab.findById(labId);
  if (!lab) { const e = new Error('Lab not found.'); e.status = 404; throw e; }

  const existing = await LabProgress.findOne(userId, labId);
  if (existing?.status === 'COMPLETED')
    return { alreadyCompleted: true, points_earned: existing.points_earned };

  await LabProgress.complete(userId, labId, lab.points);
  await updateStreak(userId);

  return { alreadyCompleted: false, points_earned: lab.points };
};

const submitFlag = async (userId, slug, flag) => {
  const record = await Lab.findFlag(slug);
  if (!record) { const e = new Error('Lab not found.'); e.status = 404; throw e; }

  if (!record.flag || record.flag.trim() !== flag.trim()) {
    const e = new Error('Incorrect flag. Try again.');
    e.status = 400;
    throw e;
  }

  const existing = await LabProgress.findOne(userId, record.id);
  if (existing?.status === 'COMPLETED')
    return { alreadyCompleted: true, points_earned: existing.points_earned };

  const hintsUsed   = existing?.hints_used || 0;
  const penalty     = hintsUsed * HINT_PENALTY;
  const finalPoints = Math.max(0, record.points - penalty);

  await LabProgress.complete(userId, record.id, finalPoints);
  await updateStreak(userId);

  return { alreadyCompleted: false, points_earned: finalPoints, penalty, hintsUsed };
};

const getUserStats = async (userId) => {
  const [stats] = await pool.query(
    `SELECT
       COUNT(*)                                          AS total_completed,
       COALESCE(SUM(points_earned), 0)                  AS total_points,
       COUNT(CASE WHEN l.difficulty='P1' THEN 1 END)    AS p1_completed,
       COUNT(CASE WHEN l.difficulty='P2' THEN 1 END)    AS p2_completed,
       COUNT(CASE WHEN l.difficulty='P3' THEN 1 END)    AS p3_completed,
       COUNT(CASE WHEN l.difficulty='P4' THEN 1 END)    AS p4_completed
     FROM user_lab_progress ulp
     JOIN labs l ON l.id = ulp.lab_id
     WHERE ulp.user_id = ? AND ulp.status = 'COMPLETED'`,
    [userId]
  );

  const [[labTotals]] = await pool.query(
    `SELECT
       COUNT(*)                                       AS total,
       COUNT(CASE WHEN difficulty='P1' THEN 1 END)   AS p1_total,
       COUNT(CASE WHEN difficulty='P2' THEN 1 END)   AS p2_total,
       COUNT(CASE WHEN difficulty='P3' THEN 1 END)   AS p3_total,
       COUNT(CASE WHEN difficulty='P4' THEN 1 END)   AS p4_total
     FROM labs`
  );

  const [[userRow]] = await pool.query(
    `SELECT current_streak, max_streak, last_activity_date FROM users WHERE id = ?`,
    [userId]
  );

  const today     = todayIST();
  const yesterday = yesterdayIST();
  const lastDate  = toISTStr(userRow?.last_activity_date);

  const isActive       = lastDate === today || lastDate === yesterday;
  const current_streak = isActive ? (userRow?.current_streak || 0) : 0;
  const max_streak     = userRow?.max_streak || 0;

  const row = stats[0];
  return {
    total_points:    Number(row.total_points),
    total_completed: Number(row.total_completed),
    total_labs:      Number(labTotals.total),
    current_streak,
    max_streak,
    by_priority: [
      { key: 'P1', completed: Number(row.p1_completed), total: Number(labTotals.p1_total) },
      { key: 'P2', completed: Number(row.p2_completed), total: Number(labTotals.p2_total) },
      { key: 'P3', completed: Number(row.p3_completed), total: Number(labTotals.p3_total) },
      { key: 'P4', completed: Number(row.p4_completed), total: Number(labTotals.p4_total) },
    ],
  };
};

const getRecentCompletions = async (userId) => {
  return LabProgress.getRecentCompletions(userId, 5);
};

const getProgressMap = async (userId) => {
  return LabProgress.getProgressMap(userId);
};

const getRecommendations = async (userId) => {
  const [completed] = await pool.query(
    `SELECT l.id, l.category, l.difficulty
     FROM user_lab_progress ulp
     JOIN labs l ON l.id = ulp.lab_id
     WHERE ulp.user_id = ? AND ulp.status = 'COMPLETED'`,
    [userId]
  );

  const completedIds = completed.map(r => r.id);

  const categoryCounts = {};
  completed.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  const solvedCount = completedIds.length;
  let targetDifficulties;
  if      (solvedCount < 5)  targetDifficulties = ['P1'];
  else if (solvedCount < 15) targetDifficulties = ['P1', 'P2'];
  else if (solvedCount < 30) targetDifficulties = ['P2', 'P3'];
  else                       targetDifficulties = ['P3', 'P4'];

  let query = 'SELECT * FROM labs';
  const params = [];
  if (completedIds.length > 0) {
    query += ` WHERE id NOT IN (${completedIds.map(() => '?').join(',')})`;
    params.push(...completedIds);
  }
  const [pending] = await pool.query(query, params);

  const scored = pending.map(lab => {
    let score = 0;
    if (targetDifficulties.includes(lab.difficulty)) score += 10;
    if (categoryCounts[lab.category])                score += categoryCounts[lab.category] * 3;
    return { ...lab, _score: score };
  });

  const DIFF_ORDER = { P1: 1, P2: 2, P3: 3, P4: 4 };
  scored.sort((a, b) =>
    b._score - a._score || DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]
  );

  return scored.slice(0, 6).map(({ _score, ...lab }) => lab);
};

module.exports = { createSession, completeLab, submitFlag, unlockHint, getUserStats, getRecentCompletions, getProgressMap, getRecommendations };
