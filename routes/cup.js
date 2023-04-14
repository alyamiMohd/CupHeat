const express = require('express')
const router = express.Router()
const Cup = require('../models/findMyCup.js')
const {isLoggedIn, isAuthor, validateCup} = require('../middleware.js')
const User = require('../models/user')
// const catchAsync = require('./utils/catchAsync.js')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.use(express.urlencoded({extended:true}))


router.get('/', async(req,res)=> {
    const cups = await Cup.find({});
    res.render('cups/index',{cups})
})


router.get('/new', isLoggedIn, (req,res)=>{
        res.render('cups/new')
})


router.post('/', isLoggedIn,async(req,res)=> {
    const cup = new Cup(req.body.cups)
    cup.author = req.user._id;
    await cup.save()
    req.flash('success','Successfully Posted!')
    res.redirect(`/cups/${cup._id}`)
})


router.get('/:id/edit',isLoggedIn, async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id);
    res.render('cups/edit',{foundCup})
})

router.patch('/:id',isAuthor, isLoggedIn,async(req,res)=> {
    const {id} = req.params;
    const cup = await Cup.findById(id)
    if (!cup){
        req.flash('error','Cannot find the coffee, or maybe its Gone :(')
        res.redirect('/cups')
    }
    const foundCup = await Cup.findByIdAndUpdate(id,req.body.cups);
    req.flash('success','Successfully Edited!')
    res.redirect(`/cups/${foundCup._id}`)
})
 

router.get('/:id', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id).populate('reviews').populate('author','username');
    if (!foundCup){
        req.flash('error','Cannot find the coffee, or maybe its Gone :(')
        res.redirect('/cups')
    }
    res.render('cups/show',{foundCup})
})


router.delete('/:id',isAuthor, async (req,res)=>{
    await Cup.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted the Cup!')
    res.redirect('/cups')
})

module.exports = router;