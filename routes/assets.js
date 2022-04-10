const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');

const assetsController = require('../controllers/assets');

//We will only use this one actually
//GET /assets/coins
// router.get('/coins/', assetsController.getCoins);

//GET /assets/coins-short
router.get('/coins-short/', assetsController.getCoinsShort);

// GET /assets/coin/:coin_id
// router.get('/coin/', assetsController.getCoin);

// POST /assets/coin
// router.post('/coin', [
//   check('name')
//     .exists()
//     .notEmpty()
//     .isString()
//     .trim()
//     .isLength({ max: 32 })
//     .bail(),
//   check('code')
//     .exists()
//     .notEmpty()
//     .isString()
//     .trim()
//     .isLength({ max: 16 })
//     .bail(),
//   check('cryptocurrency')
//     .exists()
//     .notEmpty()
//     .isString()
//     .trim()
//     .isLength({ max: 32 })
//     .bail(),
// ],
//   assetsController.createCoin);

// // DELETE /assets/coin/coin_id
// router.delete('/coin/:coin_id', assetsController.deleteCoin);

// // UPDATE /assets/coin/coin_id
// router.put('/coin/:coin_id', assetsController.updateCoin);

module.exports = router;