const express = require('express')
const router = express.Router({mergeParams:true})
const {isLoggedIn, isReviewAuthor,validateReview} = require('../middleware.js')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))
const reviews = require('../controllers/reviews.js')


router.post('/',isLoggedIn, validateReview, reviews.createReview)
router.delete('/:reviewId', isReviewAuthor,isLoggedIn, reviews.deleteReview)


module.exports = router;