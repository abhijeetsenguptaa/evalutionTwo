const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');
const { UserModel } = require('../model/user.model');
const { existingEmail } = require('../middleware/existingEmail.middleware');
const { authentication } = require('../middleware/authentication.middleware');
const { authorize } = require('../middleware/authorize.middleware');



const userRoute = express.Router();


userRoute.get('/',authentication,authorize(['admin']),async(req,res)=>{
    try{
        const data = await UserModel.find();
        res.send(data);
    }catch{
        res.status(404).json({'msg':'Error in fetching the users!'})
    }
})
userRoute.post('/signup',existingEmail,async(req,res)=>{
    try{
        const {name,email,password,role,registered_on} = req.body;
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.status(404).json({'msg':'Error in hashing the password!'})
            }else{
                const userData = new UserModel({name,email,password:hash,role,registered_on});
                await userData.save();
                res.send(await userData.save())
            }
        })
    }catch(err){
        console.log(err);
        res.status(404).json({'msg':'Error in registration!'})
    }
})


userRoute.post('/login',async(req,res)=>{
    try{
        const{email,password} = req.body;
        const data = await UserModel.find({email});
        if(data.length>=1){
            bcrypt.compare(password,data[0].password,async(err,result)=>{
                if(result){
                    const token = jsonwebtoken.sign({user_email : data[0].email},process.env.secret_key,{expiresIn:'60ms'});
                    const refresh_token = jsonwebtoken.sign({user_email : data[0].email},process.env.refresh_key,{expiresIn:'300ms'});
                    res.send({'msg':'Logged In Successfully','token':token,'refresh_token':refresh_token})
                }else{
                    res.status(404).json({'msg':'Wrong Credentials!'})
                }
            })
        }else{
            res.status(404).json({'msg':'No user Found'})
        }
    }catch(err){
        console.log(err);
        res.status(404).json({'msg':'Login Failed!'})
    }
})



userRoute.post('/logout',authentication,async(req,res)=>{
    try{
        const token = req.headers.authorization;
        if(token){
          let blacklist = JSON.parse(fs.readFileSync('blacklist.json','utf-8'));
          blacklist.push(token);
          fs.writeFileSync('blacklist.json',JSON.stringify(blacklist));
          res.send('Logged Out')  
        }
    }catch(err){
        console.log(err);
        res.status(404).json({'msg':"Error in logging out!"})
    }
})
module.exports = {userRoute}