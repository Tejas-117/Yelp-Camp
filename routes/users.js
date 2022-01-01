const express = require('express');
const router = express.Router();
const passport = require('passport');

// Models
const User = require('../models/user');

// Utils
const catchAsync = require('../utils/catchAsync');

// controller
const users = require('../controllers/users');

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;