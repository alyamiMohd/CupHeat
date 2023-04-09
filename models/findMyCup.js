const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FindMyCup = new Schema({
    title:String,
    rating:Number,
    src:String,
    description:String,
    location:String,
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:'Review'
        }
    ]
})

module.exports = mongoose.model('FindMyCup',FindMyCup)