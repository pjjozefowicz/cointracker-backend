const express = require('express');

const accountController = require('../controllers/account');

const router = express.Router();
const { check } = require('express-validator/check');
const User = require('../models/users');
const { getUsers } = require('../controllers/admin');
const { max } = require('pg/lib/defaults');
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

// GET /account/transactions
router.get('/transactions', accountController.getTransactions);

// GET /account/transaction/:tx_id
router.get('/transaction/:tx_id', accountController.getTransaction);

// GET /account/transaction/:tx_id
router.get('/transactions-by-portfolio/:portfolio_id/:cryptocurrency_id', accountController.getTransactionsByPortfolio);

// POST /account/transaction
router.post('/transaction',[
    check('rate')
    .isInt()
    .notEmpty(),
    check('amount')
    .isInt()
    .notEmpty(),
    check('total_spent')
    .isInt()
    .notEmpty(),
    check('type')
    .isString()
    .isIn(['Buy','Sell','Exchange']),    
    check('base_id')
    .exists()
    .bail(),
    // check('quote_id')
    // .isUUID()
    // .exists()
    // .bail(),
    check('date')
    .isDate()
    .notEmpty(),
    check('fee')
    .isInt()
    .notEmpty(),
    check('note')
    .isString()
    .isLength({ max:35 }),
    check('portfolio_id')
    .exists(),
], accountController.createTransaction);

// DELETE /account/transaction/tx_id
router.delete('/transaction/:tx_id', accountController.deleteTransaction);

// UPDATE /account/transaction/tx_id
router.put('/transaction/:tx_id', accountController.updateTransaction);

// GET /account/portfolios
router.get('/portfolios', accountController.getPortfolios);

// GET /account/portfolio/:portfolio_id
router.get('/portfolio/:portfolio_id', checkJwt, accountController.getPortfolio);

router.get('/portfolios-by-owner/:owner_id', accountController.getPortfoliosByUserId);

// POST /account/portfolio
router.post('/portfolio',[
    //check('owner_id') PAMIETAC ZEBY ODKOMENTOWAC JAK BEDZIE AUTH0
    //.exists(),  PAMIETAC ZEBY ODKOMENTOWAC JAK BEDZIE AUTH0
    check('name')
    .isString()
    .exists()
    .notEmpty()
    .isLength({ max:32 }),
    check('is_main')
    .isBoolean()
    .exists()
    .notEmpty()
],  accountController.createPortfolio);

// DELETE /account/portfolio/:portfolio_id
router.delete('/portfolio/:portfolio_id', accountController.deletePortfolio);

// UPDATE /account/portfolio/:portfolio_id
router.put('/portfolio/:portfolio_id', accountController.updatePortfolio);

// GET /account/balances
router.get('/balances', accountController.getBalances);

// GET /account/balance/:balance_id
router.get('/balance/:balance_id', accountController.getBalance);

// GET /account/balances-by-portfolio/:portfolio_id
router.get('/balances-by-portfolio/:portfolio_id', accountController.getBalancesByPortfolioId);

// POST /account/balance
router.post('/balance',[
    check('portfolio_id')
    .exists()
    .notEmpty()
    .bail(),
    check('currency_id')
    .exists()
    .notEmpty(),
], accountController.createBalance);

// DELETE /account/balance/:balance_id
router.delete('/balance/:balance_id', accountController.deleteBalance);

// UPDATE /account/balance/:balance_id
router.put('/balance/:balance_id', accountController.updateBalance);

module.exports = router;