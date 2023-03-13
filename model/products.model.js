const mongoose = require('mongoose');




const productSchema = mongoose.Schema({
    name : String,
    category : String,
    price : Number,
    added_on : {
        type:Date,
        default:Date.now
    }
},{
    versionKey:false
})



const ProductModel = mongoose.model('products',productSchema);



module.exports = {ProductModel};