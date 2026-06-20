const { verify } = require('../services/jwtService');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const payload = verify(token);
    const user = await User.findById(payload.id);
    if (!user || user.token_version !== payload.tv)
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
