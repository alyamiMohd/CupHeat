

const express = require('express')
const router = express.Router()
const Cup = require('../models/findMyCup.js')
const {isLoggedIn, isAuthor, validateCup} = require('../middleware.js')
const User = require('../models/user')
// const catchAsync = require('./utils/catchAsync.js')
const cups = require('../controllers/cup.js')
const methodOverride = require('method-override')
router.use(methodOverride('_method'))
const multer = require('multer')
const {storage} = require('../cloudinary/index.js')
const upload = multer({storage})


// router.use(express.urlencoded({extended:true}))

router.route('/')
    .get(cups.index)
    .post(isLoggedIn,upload.array('image') ,cups.createForm)

router.get('/new', isLoggedIn, cups.renderNewForm)

router.route('/:id')
    .get(cups.show)
    .patch(isAuthor, isLoggedIn,upload.array('image'), cups.editForm)
    .delete(isAuthor,cups.delete)

router.get('/:id/edit',isLoggedIn,cups.renderEditForm)
module.exports = router;