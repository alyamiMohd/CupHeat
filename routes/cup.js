const express = require('express')
const router = express.Router()
const Cup = require('../models/findMyCup.js')
const {isLoggedIn} = require('../middleware.js')
const {cupSchema} = require('../schemas.js')
const User = require('../models/user')
// const catchAsync = require('./utils/catchAsync.js')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.use(express.urlencoded({extended:true}))

const validateCup = (req,res,next)=>{
    const {error} = cupSchema.validate(req.body)
    if(error){
        throw new Error()
    }
    next()
}


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

router.patch('/:id',isLoggedIn,async(req,res)=> {
    const {id} = req.params;
    const cup = await Cup.findById(id)
    if (!cup){
        req.flash('error','Cannot find the coffee, or maybe its Gone :(')
        res.redirect('/cups')
    }
    if(!cup.author.equals(req.user._id)){
        req.flash('error','You dont have permissions to do that.')
        return res.redirect(`/cups/${id}`)
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


router.delete('/:id', async (req,res)=>{
    await Cup.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted the Cup!')
    res.redirect('/cups')
})

module.exports = router;