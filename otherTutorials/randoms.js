// MIDDLEWARES --------------------------------------//
const express = require('express')
const app = express();
const AppError = require('./AppError')
const verifyPassword = (req,res,next)=>{
    const {password} = req.query
    if (password !== 'monkey'){
        throw new AppError('Password required', 401)
    } else{
        next()
}
}

app.get('/error', (req,res)=>{
    monkey.eat()
})



app.get('/secret',verifyPassword, (req,res,next)=>{
    res.send("My secret is: I love monkeys so much that I can trade my pc for a good loyal monkey")
})

app.use((req,res)=>{
    res.status(404).send("NOT FOUND")
})

app.use((err,req,res,next)=>{
    const {status =500,message=500} = err;
    res.status(status).send(message)
})
app.listen(1234)

//------------------------------------------------------------//