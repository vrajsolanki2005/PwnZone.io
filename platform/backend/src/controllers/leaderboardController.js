const pool = require('../config/db');

const LEVEL_THRESHOLDS = [0, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000];
const LEVEL_TITLES     = ['','Rookie','Script Kiddie','Apprentice','Explorer','Hacker','Senior Hacker','Elite Hacker','Master Hacker','Legend','God Mode'];

function getLevel(points) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1; else break;
  }
  return level;
}

const getLeaderboard = async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    let dateWhere = '';
    if      (period === 'weekly')  dateWhere = `AND ulp.completed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
    else if (period === 'monthly') dateWhere = `AND ulp.completed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;

    const [rows] = await pool.query(
      `SELECT
         u.id, u.name, u.avatar,
         u.current_streak,
         COALESCE(SUM(CASE WHEN ulp.status = 'COMPLETED' ${dateWhere} THEN ulp.points_earned ELSE 0 END), 0) AS total_points,
         COUNT(CASE WHEN ulp.status = 'COMPLETED' ${dateWhere} THEN 1 END)                                   AS labs_solved
       FROM users u
       LEFT JOIN user_lab_progress ulp ON ulp.user_id = u.id
       GROUP BY u.id, u.name, u.avatar, u.current_streak
       ORDER BY total_points DESC
       LIMIT 50`
    );

    const result = rows.map((r, i) => {
      const points = Number(r.total_points);
      const level  = getLevel(points);
      return {
        rank:           i + 1,
        id:             r.id,
        name:           r.name,
        avatar:         r.avatar,
        points,
        labs_solved:    Number(r.labs_solved),
        current_streak: Number(r.current_streak) || 0,
        level,
        level_title:    LEVEL_TITLES[level] || 'God Mode',
        progress:       Math.round((points / 20000) * 100),
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeaderboard };
