const bcrypt = require('bcryptjs');
const User = require('../models/User');
const pool = require('../config/db');
const { sign } = require('./jwtService');

const register = async ({ name, email, password }) => {
  if (await User.findByEmail(email)) {
    const err = new Error('Email already in use.'); err.status = 409; throw err;
  }
  const hashed = await bcrypt.hash(password, 12);
  const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
  const user = await User.create({ name, email, password: hashed, avatar, provider: 'local' });
  return { token: sign(user), user: { id: user.id, name, email, avatar } };
};

const logout = async (id) => {
  await User.incrementTokenVersion(id);
};

const getMe = async (id) => {
  const user = await User.findById(id);
  if (!user) { const err = new Error('User not found.'); err.status = 404; throw err; }
  const { password, ...safe } = user;
  return safe;
};

const handleGoogleProfile = async (profile) => {
  let user = await User.findByGoogleId(profile.id);
  if (!user) {
    user = await User.findByEmail(profile.emails[0].value);
    if (user) {
      await pool.query('UPDATE users SET google_id = ?, provider = "google" WHERE id = ?', [profile.id, user.id]);
    } else {
      const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(profile.displayName)}`;
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar,
        google_id: profile.id,
        provider: 'google',
      });
    }
  }
  return user;
};

module.exports = { register, getMe, logout, handleGoogleProfile };
