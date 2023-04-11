const express = require('express')
const router = express.Router({mergeParams:true})
const {reviewSchema} = require('../schemas.js')
const Cup = require('../models/findMyCup.js')
const Review = require('../models/review.js')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))



const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        throw new Error()
    }
    next()
}

router.post('/',validateReview, async (req,res)=>{
    const cup = await Cup.findById(req.params.id)
    const reviews = await new Review(req.body.review)
    cup.reviews.push(reviews)
    await reviews.save()
    await cup.save()
    req.flash('success','Created new Review!')
    res.redirect(`/cups/${cup._id}`)
})


router.delete('/:reviewId', async(req,res)=>{
    const {id, reviewId} = req.params;
    const cup = await Cup.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted the Review!')
    res.redirect(`/cups/${id}`)
})


module.exports = router;