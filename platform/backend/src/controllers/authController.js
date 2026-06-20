const passport = require('../config/passport');
const { register, getMe, logout } = require('../services/authService');
const { sign } = require('../services/jwtService');

//registerUser
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });
    const result = await register({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

//loginUser
const loginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Login failed.' });
    res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  })(req, res, next);
};

//googleCallback
const googleCallback = (req, res) => {
  const token = sign(req.user);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};

//getAuthUser
const getAuthUser = async (req, res) => {
  try {
    const user = await getMe(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

//logoutUser
// Since we're using JWTs, logout can be handled on the client side by simply deleting the token.
// If you want to implement server-side token invalidation, you would need to maintain a blacklist of tokens.

const logoutUser = async (req, res) => {
  try {
    await logout(req.user.id);
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, googleCallback, getAuthUser, logoutUser };
