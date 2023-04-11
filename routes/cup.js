const express = require('express')
const router = express.Router()
const Cup = require('../models/findMyCup.js')
const {cupSchema} = require('../schemas.js')
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


router.get('/new',(req,res)=>{
    res.render('cups/new')
})


router.post('/', async(req,res)=> {
    const cup = new Cup(req.body.cups)
    await cup.save()
    req.flash('success','Successfully Posted!')
    res.redirect(`/cups/${cup._id}`)
})


router.get('/:id/edit', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id);
    res.render('cups/edit',{foundCup})
})

router.patch('/:id',async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findByIdAndUpdate(id,req.body.cups);
    if (!foundCup){
        req.flash('error','Cannot find the coffee, or maybe its Gone :(')
        res.redirect('/cups')
    }
    req.flash('success','Successfully Edited!')
    res.redirect(`/cups/${foundCup._id}`)
})
 

router.get('/:id', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id).populate('reviews');
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