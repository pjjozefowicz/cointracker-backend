const express = require('express');

const accountController = require('../controllers/account');

const router = express.Router();

// GET /feed/posts
router.get('/portfolios', accountController.getPortfolios);

// POST /feed/post
// router.post('/post', feedController.createPost);

module.exports = router;