const express = require('express')
const app = express()
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const cupRoute = require('./routes/cup.js')
const reviewsRoute = require('./routes/reviews.js')
const path = require('path');
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017/FindMyCup',{
    useNewUrlParser:true});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected!")
})

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
app.use((err,req,res,next)=>{
    console.log('oh boy')
    console.log(err)
})

app.listen(3000,(req,res)=> {
    console.log('Listening on port 3000!')
})