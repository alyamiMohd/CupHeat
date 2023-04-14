const {cupSchema} = require('./schemas.js')
const Cup = require('./models/findMyCup.js')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in!')
        return res.redirect('/login')
    } 
    next()
}

module.exports.validateCup = (req,res,next)=>{
    const {error} = cupSchema.validate(req.body)
    if(error){
        throw new Error()
    }
    next()
}

module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const cup = await Cup.findById(id);
    if(!cup.author.equals(req.user._id)){
        req.flash('error','You dont have permissions to do that.')
        return res.redirect(`/cups/${id}`)
    }
    next();
}