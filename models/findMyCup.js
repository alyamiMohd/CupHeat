const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const imageSchema = new Schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const FindMyCup = new Schema({
    title:String,
    geometry:{
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    rating:Number,
    src:[imageSchema],
    description:String,
    location:String,
    author: {
        type:Schema.Types.ObjectId,
        ref :'User'
    },
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