const { verify } = require('../services/jwtService');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const payload = verify(token);
    const [rows] = await pool.query('SELECT id, is_admin, token_version FROM users WHERE id = ?', [payload.id]);
    const user = rows[0];
    if (!user || user.token_version !== payload.tv)
      return res.status(401).json({ message: 'Session expired.' });
    if (!user.is_admin)
      return res.status(403).json({ message: 'Admin access required.' });
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
