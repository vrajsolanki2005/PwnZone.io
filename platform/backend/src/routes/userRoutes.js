const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const { getProfile, updateProfile, changePassword, resetProgress, deleteAccount } = require('../controllers/userController');

router.get('/profile',          auth, getProfile);
router.patch('/profile',        auth, updateProfile);
router.patch('/password',       auth, changePassword);
router.delete('/progress',      auth, resetProgress);
router.delete('/account',       auth, deleteAccount);

module.exports = router;
