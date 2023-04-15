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
            src: [
                {
                  url: 'https://res.cloudinary.com/dztowvrak/image/upload/v1681539368/CupHeat/qro4ocqzskfqhw777zjk.jpg',
                  filename: 'CupHeat/qro4ocqzskfqhw777zjk',
                },
                {
                  url: 'https://res.cloudinary.com/dztowvrak/image/upload/v1681539368/CupHeat/tlttk5wjbd9b6x01dgzf.jpg',
                  filename: 'CupHeat/tlttk5wjbd9b6x01dgzf',
                }
              ],
            rating:price,
            author:'6436c35c246cdb9662249949',
            description:'Lorem blanditiis tenetur fugit vitae! Ut, ad reprehenderit reiciendis voluptatem nemo enim dolores.'
        })
        await cup.save()
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close()
})