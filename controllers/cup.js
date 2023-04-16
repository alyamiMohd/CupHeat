const Cup = require('../models/findMyCup.js')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken:mapBoxToken})

module.exports.index = async(req,res)=> {
    const cups = await Cup.find({});
    res.render('cups/index',{cups})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('cups/new')
}

module.exports.createForm = async(req,res)=> {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.cups.location,
        limit:1
    }).send()
    const cup = new Cup(req.body.cups)
    cup.geometry = geoData.body.features[0].geometry;
    cup.src = req.files.map(f=>({url:f.path,filename:f.filename}))
    cup.author = req.user._id;
    console.log(cup)
    await cup.save()
    req.flash('success','Successfully Posted!')
    res.redirect(`/cups/${cup._id}`)
}


module.exports.renderEditForm =  async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id);
    res.render('cups/edit',{foundCup})
}

module.exports.editForm = async(req,res)=> {
    const {id} = req.params;
    const cup = await Cup.findById(id)
    if (!cup){
        req.flash('error','Cannot find the coffee, or maybe its Gone :(')
        res.redirect('/cups')
    }
    const foundCup = await Cup.findByIdAndUpdate(id,req.body.cups);
    const imgs = req.files.map(f=> ({url: f.path, filename:f.filename}));
    foundCup.src.push(...imgs)
    await foundCup.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await cup.updateOne({$pull:{src:{filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success','Successfully Edited!')
    res.redirect(`/cups/${foundCup._id}`)
}


module.exports.show = async(req,res)=> {
    const {id} = req.params;
    const foundCup = await Cup.findById(id).populate({path:'reviews',
    populate:{
        path:'author'
        }
    }).populate('author');
        if (!foundCup){
            req.flash('error','Cannot find the coffee, or maybe its Gone :(')
            res.redirect('/cups')
        }
        res.render('cups/show',{foundCup})
    }


module.exports.delete = async (req,res)=>{
    await Cup.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully deleted the Cup!')
    res.redirect('/cups')
}