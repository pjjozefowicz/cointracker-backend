const express = require('express');

const assetsController = require('../controllers/assets');

const router = express.Router();
const { check } = require('express-validator/check');
const jwt = require("express-jwt"); // NEW
const jwksRsa = require("jwks-rsa"); // NEW
const authConfig = {
    domain: "cointracker.eu.auth0.com",
    audience: "https://cointracker.eu.auth0.com/api/v2/"
  };

// NEW
// Create middleware to validate the JWT using express-jwt
const checkJwt = jwt({
  // Provide a signing key based on the key identifier in the header and the signing keys provided by your Auth0 JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  // Validate the audience (Identifier) and the issuer (Domain).
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
});

// GET /assets/coins
// router.get('/coins/', checkJwt, assetsController.getCoins);

// app.use('/assets/:id', checkJwt, assetsRoutes => {
//     const id = Number(req.params.id)
//     const event = events.find(event => event.id ===id);
//     res.send(event);
// });

// GET /assets/history
// router.get('/history/', assetsController.getHistory);

// GET /assets/coininfo
// router.get('/coininfo/', assetsController.getCoininfo)


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
    check('cryptocurrency')
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

// // GET dashboardinfo
// router.get('/dashboard/:portfolio_id', assetsController.getDashboardData);

module.exports = router;