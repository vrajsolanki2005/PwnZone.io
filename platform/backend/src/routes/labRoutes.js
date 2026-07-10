const router = require('express').Router();
const { listLabs, getLab, getLabByIdHandler, getLabMetaHandler } = require('../controllers/labController');

router.get('/', listLabs);
router.get('/id/:id', getLabByIdHandler);
router.get('/meta/:labId', getLabMetaHandler);
router.get('/:slug', getLab);

module.exports = router;
