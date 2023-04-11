const express = require('express')
const app = express()
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const cupRoute = require('./routes/cup.js')
const reviewsRoute = require('./routes/reviews.js')
const flash = require('connect-flash')
const path = require('path');
app.use(express.urlencoded({extended:true}))
const session = require('express-session')
app.use(express.urlencoded({extended:true}))


mongoose.connect('mongodb://127.0.0.1:27017/FindMyCup',{
    useNewUrlParser:true});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected!")
})

app.use(session({secret:'topNotchSecret', saveUninitialized:true, resave:false,
cookie:{
    httpOnly:true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
}
}))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    next()
})
app.use(express.static(path.join(__dirname,'public')))
app.set(path.join(__dirname,'/views'))
app.set('view engine','ejs')
app.use('/cups',cupRoute)
app.use('/cups/:id/reviews', reviewsRoute)
app.engine('ejs',ejsMate)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
// app.use(morgan('tiny'))
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

app.delete('/cups/:id/reviews/:reviewId', async(req,res)=>{
    const {id, reviewId} = req.params;
    const cup = await Cup.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/cups/${id}`)
})


app.use((err,req,res,next)=>{
    console.log('oh boy')
    console.log(err)
})

app.listen(3000,(req,res)=> {
    console.log('Listening on port 3000!')
})