const express = require('express');

const assetsController = require('../controllers/assets');

const router = express.Router();
const { check } = require('express-validator/check');

// GET /assets/coins
router.get('/coins', assetsController.getCoins);

// GET /assets/coins
router.get('/history/', assetsController.getHistory);


// GET /assets/coin/:coin_id
router.get('/coin/', assetsController.getCoin);

// POST /assets/coin
router.post('/coin',[
    check('name')
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .isLength({ max:32 })
    .bail(),
    check('code')
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .isLength({ max:16 })
    .bail(),
    check('coingecko_id')
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .isLength({ max:32 })
    .bail(),
],
assetsController.createCoin);

// DELETE /assets/coin/coin_id
router.delete('/coin/:coin_id', assetsController.deleteCoin);

// UPDATE /assets/coin/coin_id
router.put('/coin/:coin_id', assetsController.updateCoin);

module.exports = router;