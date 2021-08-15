const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');
// GET /api/sauces
router.get('/', auth, sauceCtrl.getAllSauce);
// GET /api/sauces/:id
router.get('/:id', auth, sauceCtrl.getOneSauce);
// POST /api/sauces
router.post('/', auth, multer, sauceCtrl.createSauce);
// PUT /api/sauces/:id
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// DELETE /api/sauces/:id
router.delete('/:id', auth, sauceCtrl.deleteSauce);


router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;







