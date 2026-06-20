const jwt = require('jsonwebtoken');

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, name: user.name, avatar: user.avatar, tv: user.token_version ?? 0 },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { sign, verify };
