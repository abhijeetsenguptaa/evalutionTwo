const jsonwebtoken = require('jsonwebtoken');
const { UserModel } = require('../model/user.model');
const fs = require('fs');
require('dotenv').config()



const authentication = (req,res,next) => {
    const token = req.headers.authorization
    const blacklist = JSON.parse(fs.readFileSync('blacklist.json','utf-8'));
    if(blacklist.includes(token)){
        res.send('You have been logged out')
    }else{
        if(token){
            jsonwebtoken.verify(token,process.env.secret_key,async(err,decode)=>{
               if(decode){
                user_email = decode.user_email;
                const data = await UserModel.find({email:user_email});
                role = data[0].role
                console.log(role)
                next();
               }else{
                console.log(err);
                res.status(404).json({'msg':'Token Expired!'})
               }
            })
        }else{
            res.status(404).json({'msg':'Protected Route!!'})
        }
    }
}

module.exports = {authentication};