const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')


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


FindMyCup.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('FindMyCup',FindMyCup)