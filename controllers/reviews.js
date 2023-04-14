const Review = require('../models/review.js')
const Cup = require('../models/findMyCup.js')

module.exports.createReview = async (req,res)=>{
    const cup = await Cup.findById(req.params.id)
    const reviews = await new Review(req.body.review)
    reviews.author = req.user._id;
    cup.reviews.push(reviews)
    await reviews.save()
    await cup.save()
    req.flash('success','Created new Review!')
    res.redirect(`/cups/${cup._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Cup.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted the Review!')
    res.redirect(`/cups/${id}`)
}