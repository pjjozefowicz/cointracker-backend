const express = require('express');

const assetsController = require('../controllers/assets');

const router = express.Router();

// GET /assets/coins
router.get('/coins', assetsController.getCoins);

// GET /assets/coin/:coin_id
router.get('/coin/:coin_id', assetsController.getCoin);

// POST /assets/coin
router.post('/coin', assetsController.createCoin);

// DELETE /assets/coin/coin_id
router.delete('/coin/:coin_id', assetsController.deleteCoin);

// UPDATE /assets/coin/coin_id
router.put('/coin/:coin_id', assetsController.updateCoin);

module.exports = router;