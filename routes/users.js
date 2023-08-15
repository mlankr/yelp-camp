const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {validateRegistrationInfo} = require("../middleware");
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegistrationForm)
    .post(validateRegistrationInfo , catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local',
        {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;