const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Too many requests. Please wait a moment before asking again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = aiLimiter;
