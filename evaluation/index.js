const express = require('express');
const {connection} = require('./configs/connection');
const { productRoute } = require('./route/product.route');
const { userRoute } = require('./route/user.route');
require('dotenv').config();

const app = express();
app.use(express.json());



app.get('/',(req,res)=>{
    res.send('Welcome to the Homepage')
})

app.use('/users',userRoute)
app.use('/products',productRoute)

app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log('Connected to the Database!');
    }catch(err){
        console.log('Could not connect to the Database!');
    }
    console.log(`Server is running at the port:${process.env.port}`);
})