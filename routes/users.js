const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
router.use(express.urlencoded({extended:true}))

router.get('/register',(req,res)=>{
    res.render('../views/users/register')
})

router.post('/register',(req,res)=>{
    res.send(req.body)
})

module.exports = router;