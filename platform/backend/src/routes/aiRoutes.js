const router = require('express').Router();
const { authenticate } = require('../middleware/authMiddleware');
const aiLimiter = require('../middleware/aiLimiter');
const { chatHandler } = require('../controllers/aiController');

router.post('/chat', authenticate, aiLimiter, chatHandler);

module.exports = router;
