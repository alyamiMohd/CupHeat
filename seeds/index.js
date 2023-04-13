const mongoose = require('mongoose')
const cities = require('./cities.json')
const Cup = require('../models/findMyCup.js')
const {discriptors,cupProviders} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/FindMyCup',{
    useNewUrlParser:true,
    useUnifiedTopology:true});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected!")
})

const price = Math.floor(Math.random()*5)+1;
const sample = array => array[Math.floor(Math.random()*array.length)];
const seedDB = async() => {
    await Cup.deleteMany({})
    for (let i =0; i<50; i++) {
        let random22 =  Math.floor(Math.random()*22);
        const cup = new Cup ({
            title:`${sample(discriptors)} ${sample(cupProviders)}`,
            location:`${cities[random22].city}`,
            src:'https://source.unsplash.com/collection/1528792',
            rating:price,
            author:'643776d703e835beb9f36b0d',
            description:'Lorem blanditiis tenetur fugit vitae! Ut, ad reprehenderit reiciendis voluptatem nemo enim dolores.'
        })
        await cup.save()
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close()
})