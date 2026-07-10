const router = require('express').Router();
const passport = require('../config/passport');
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser, googleCallback, getAuthUser, logoutUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  googleCallback
);
router.get('/me', authMiddleware, getAuthUser);
router.post('/logout', authMiddleware, logoutUser);

module.exports = router;
