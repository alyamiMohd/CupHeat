const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
router.use(express.urlencoded({extended:true}))
const users = require('../controllers/users')
const passport = require('passport')

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'login'}),users.loginUser)

router.route('/register')
    .get(users.index)
    .post(users.registerUser)

router.get('/logout',users.logout);

module.exports = router;