if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

// Importing
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require("connect-mongo");
const secret = process.env.SECRET || 'thisisasecret'


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/FindMyCup'
//suppressing mongoose error
mongoose.set('strictQuery', false);
// mongodb://127.0.0.1:27017/FindMyCup
// Database
mongoose.connect(dbUrl,{
    useNewUrlParser:true});
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected!")
})




// Routes
const cupRoute = require('./routes/cup.js')
const reviewsRoute = require('./routes/reviews.js')
const usersRoute = require('./routes/users')


// passport auth
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//Use methods 
app.use(session({secret, saveUninitialized:true, resave:false,
cookie:{
    name:'session',
    httpOnly:true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    store: MongoStore.create({mongoUrl:dbUrl, secret,touchAfter:24*3600})
}
}))
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})
app.use(express.static(path.join(__dirname,'public')))
app.use('/',usersRoute)
app.use('/cups',cupRoute)
app.use('/cups/:id/reviews', reviewsRoute)
app.use(methodOverride('_method'))
app.use(mongoSanitize());



// app set ejs and its engine
app.set(path.join(__dirname,'/views'))
app.set('view engine','ejs')
app.engine('ejs',ejsMate)


// Main Route
app.get('/', (req,res) =>{
    res.render('home')
})

// Server listening
app.listen(3000,(req,res)=> {
    console.log('Listening on port 3000!')
})