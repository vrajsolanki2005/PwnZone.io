const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const { complete, flagSubmit, hintUnlock, stats, recent, progressMap, recommendations } = require('../controllers/labProgressController');

// POST /api/progress/:labId/complete
router.post('/:labId/complete', auth, complete);

// POST /api/progress/:slug/flag
router.post('/:slug/flag', auth, flagSubmit);

// POST /api/progress/:slug/hint
router.post('/:slug/hint', auth, hintUnlock);

// GET  /api/progress/stats
router.get('/stats', auth, stats);

// GET  /api/progress/recent
router.get('/recent', auth, recent);

// GET  /api/progress/map   → { [labId]: 'COMPLETED' | 'PENDING' }
router.get('/map', auth, progressMap);

// GET  /api/progress/recommendations
router.get('/recommendations', auth, recommendations);

module.exports = router;
