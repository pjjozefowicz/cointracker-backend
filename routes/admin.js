const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();
const { check } = require('express-validator/check');

// GET /admin/users
router.get('/users', adminController.getUsers);

// POST /admin/user
router.post('/user',[
    check('auth0_id')
    .notEmpty()
    .isDecimal(),
], adminController.createUser);

// DELETE /admin/user
router.delete('/user/:auth_id', adminController.deleteUser);

module.exports = router;