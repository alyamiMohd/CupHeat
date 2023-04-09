const express = require('express')
const mongoose = require('mongoose');
const Cup = require('./models/findMyCup.js')
const methodOverride = require('method-override')
const morgan = require('morgan')
const catchAsync = require('./utils/catchAsync.js')
const ejsMate = require('ejs-mate')
const Review = require('./models/review.js')
const {cupSchema, reviewSchema} = require('./schemas.js')

mongoose.connect('mongodb://127.0.0.1:27017/FindMyCup',{
    useNewUrlParser:true});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected!")
})

const app = express()
const path = require('path');
const e = require('express');

app.set(path.join(__dirname,'/views'))
app.set('view engine','ejs')

app.engine('ejs',ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
// app.use(morgan('tiny'))

const validateCampground = (req,res,next)=>{
    const {error} = cupSchema.validate(req.body)
    if(error){
        throw new Error()
    }
    next()
}


const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        throw new Error()
    }
    next()
}

app.get('/', (req,res) =>{
    res.render('home')
})

app.get('/cups', async(req,res)=> {
    const cups = await Cup.find({});
    res.render('cups/index',{cups})
})


app.get('/cups/new',(req,res)=>{
    res.render('cups/new')
})


app.post('/cups', async(req,res)=> {
    const cup = new Cup(req.body.cups)
    console.log(cup)
    await cup.save()
    res.redirect(`/cups/${cup._id}`)
})


app.get('/cups/:id/edit', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id);
    res.render('cups/edit',{foundCup})
})

app.patch('/cups/:id', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findByIdAndUpdate(id,req.body.cups);
    res.redirect(`/cups/${id}`)
})
 

app.get('/cups/:id', async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id).populate('reviews');
    res.render('cups/show',{foundCup})
})


app.delete('/cups/:id', async (req,res)=>{
    await Cup.findByIdAndDelete(req.params.id);
    res.redirect('/cups')
})


app.post('/cups/:id/reviews',validateReview, async (req,res)=>{
    const cup = await Cup.findById(req.params.id)
    const reviews = await new Review(req.body.review)
    cup.reviews.push(reviews)
    await reviews.save()
    await cup.save()
    res.redirect(`/cups/${cup._id}`)
})

// that's an edit(git demo)


app.use((err,req,res,next)=>{
    console.log('oh boy')
    console.log(err)
})



//that's from my laptop, please work

app.listen(3000,(req,res)=> {
    console.log('Listening on port 3000!')
})