const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

// GET /api/sauces
// GET /api/sauces/:id
// POST /api/sauces
// PUT /api/sauces/:id
// DELETE /api/sauces/:id
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// POST /api/sauces/:id/like - not yet created
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;







