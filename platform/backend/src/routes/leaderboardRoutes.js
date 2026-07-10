const router = require('express').Router();
const { getLeaderboard } = require('../controllers/leaderboardController');

// GET /api/leaderboard?period=all|weekly|monthly
router.get('/', getLeaderboard);

module.exports = router;
