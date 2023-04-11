const express = require('express')
const router = express.Router()
const Cup = require('../models/findMyCup.js')
// const catchAsync = require('./utils/catchAsync.js')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))

router.use(express.urlencoded({extended:true}))

const validateCampground = (req,res,next)=>{
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
    req.flash('success','You have successfully posted a form!')
    res.redirect(`/cups/${cup._id}`)
})


router.get('/:id/edit', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id);
    res.render('cups/edit',{foundCup})
})

router.patch('/:id', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findByIdAndUpdate(id,req.body.cups);
    res.redirect(`/cups/${id}`)
})
 

router.get('/:id', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id).populate('reviews');
    res.render('cups/show',{foundCup})
})


router.delete('/:id', async (req,res)=>{
    await Cup.findByIdAndDelete(req.params.id);
    res.redirect('/cups')
})

module.exports = router;