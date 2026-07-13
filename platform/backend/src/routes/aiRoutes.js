const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const aiLimiter = require('../middleware/aiLimiter');
const { chatHandler } = require('../controllers/aiController');

router.post('/chat', auth, aiLimiter, chatHandler);

module.exports = router;
