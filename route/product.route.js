const express = require('express');
const { authentication } = require('../middleware/authentication.middleware');
const { authorize } = require('../middleware/authorize.middleware');
const { ProductModel } = require('../model/products.model');




const productRoute = express.Router();


productRoute.get('/',authentication,async(req,res)=>{
    try{
        const data = await ProductModel.find();
        res.send(data);
    }catch(err){
        console.log(err);
        res.status(404).json({'msg':'Error in fetching the Products'})
    }
})


productRoute.post('/addproducts',authentication,authorize(['seller']),async(req,res)=>{
    try{
        const {name,category,price,added_on} = req.body;
        const newProduct = new ProductModel({name,category,price,added_on});
        await newProduct.save();
        res.send(await newProduct.save())
    }catch(err){
        console.log(err);
        res.status(404).json({'msg':'Error in adding the Products'})
    }
})

productRoute.delete('/deleteproducts/:id',authentication,authorize(['seller']),async(req,res)=>{
    try{
        const id = req.params.id;
        await ProductModel.findByIdAndDelete({_id:id});
        res.send(await ProductModel.find())
    }catch(err){
        console.log(err);
        res.status(404).json({'msg':'Error in deleting the Products'})
    }
})

module.exports = {productRoute}