const User = require('../models/user')

module.exports.index = (req,res)=>{
    res.render('../views/users/register')
}

module.exports.registerUser = async (req,res)=>{
    try{
    const {username,password,email} = req.body;
    const user = new User({username,email})
    const regUser = await User.register(user,password);
    req.login(regUser, err=>{
        if(err) next(err);
        req.flash('success','Welcome to CupHeat!')
        res.redirect('/cups')
    });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin =(req,res)=>{
    res.render('users/login')
}

module.exports.loginUser = (req,res)=>{
    req.flash('success','Welcome back!')
    const redirectUrl = req.session.returnTo || '/cups'
    res.redirect(redirectUrl)
}



module.exports.logout =  function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','Goodbye me Fwiend :(((**LSDJKFLSKDFJ')
      res.redirect('/cups');
    });
  }