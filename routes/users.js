const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
router.use(express.urlencoded({extended:true}))
const User = require('../models/user')
const passport = require('passport')


router.get('/register',(req,res)=>{
    res.render('../views/users/register')
})

router.post('/register',async (req,res)=>{
    try{
    const {username,password,email} = req.body;
    const user = new User({username,email})
    const regUser = await User.register(user,password);
    req.login(regUser, err=>{
        if(err) next(err);
        req.flash('success','Welcome to CupHeat!')
        res.redirect('/cups')
    });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
})

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'login'}),(req,res)=>{
        req.flash('success','Welcome back!')
        const redirectUrl = req.session.returnTo || '/cups'
        res.redirect(redirectUrl)
})

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','Goodbye me Fwiend :(((**LSDJKFLSKDFJ')
      res.redirect('/cups');
    });
  });

module.exports = router;