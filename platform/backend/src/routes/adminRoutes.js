const router     = require('express').Router();
const auth       = require('../middleware/authMiddleware');
const adminAuth  = require('../middleware/adminMiddleware');
const {
  getStats, getUsers, updateUser, resetUserProgress, deleteUser,
  getLabs, createLab, updateLab, deleteLab,
} = require('../controllers/adminController');

router.use(adminAuth);

router.get('/stats',                  getStats);
router.get('/users',                  getUsers);
router.patch('/users/:id',            updateUser);
router.delete('/users/:id/progress',  resetUserProgress);
router.delete('/users/:id',           deleteUser);
router.get('/labs',                   getLabs);
router.post('/labs',                  createLab);
router.patch('/labs/:id',             updateLab);
router.delete('/labs/:id',            deleteLab);

module.exports = router;
