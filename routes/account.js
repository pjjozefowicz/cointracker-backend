const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');
const { check } = require('express-validator/check');

// GET /account/transactions
router.get('/transactions', accountController.getTransactions);

// GET /account/transaction/:tx_id
router.get('/transaction/:tx_id', accountController.getTransaction);

// GET /account/transaction/:tx_id
router.get('/transactions-by-portfolio/:portfolio_id/:cryptocurrency_id', accountController.getTransactionsByPortfolio);

// GET /account/transaction/:tx_id
router.get('/transactions-by-balance/:balance_id', accountController.getTransactionsByBalance);

// POST /account/transaction
router.post('/transaction',[
    // check('rate')
    // .isInt()
    // .notEmpty(),
    // check('amount')
    // .isInt()
    // .notEmpty(),
    // check('total_spent')
    // .isInt()
    // .notEmpty(),
    // check('type')
    // .isString()
    // .isIn(['Buy','Sell','Exchange']),    
    // check('base_id')
    // .exists()
    // .bail(),
    // // check('quote_id')
    // // .isUUID()
    // // .exists()
    // // .bail(),
    // check('date')
    // .isDate()
    // .notEmpty(),
    // check('fee')
    // .isInt()
    // .notEmpty(),
    // check('note')
    // .isString()
    // .isLength({ max:35 }),
    // check('portfolio_id')
    // .exists(),
], accountController.createTransaction);

// DELETE /account/transaction/tx_id
router.delete('/transaction/:tx_id', accountController.deleteTransaction);

// UPDATE /account/transaction/tx_id
router.put('/transaction/:tx_id', accountController.updateTransaction);

// GET /account/portfolios
router.get('/portfolios', accountController.getPortfolios);

// GET /account/portfolio/:portfolio_id
router.get('/portfolio/:portfolio_id', accountController.getPortfolio);

router.get('/portfolios-by-owner/:owner_id', accountController.getPortfoliosByUserId);

router.post('/main-portfolio/:portfolio_id', accountController.setPortfolioAsMain);

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
    check('coin_id')
    .exists()
    .notEmpty(),
], accountController.createBalance);

// DELETE /account/balance/:balance_id
router.delete('/balance/:balance_id', accountController.deleteBalance);

// UPDATE /account/balance/:balance_id
router.put('/balance/:balance_id', accountController.updateBalance);

module.exports = router;