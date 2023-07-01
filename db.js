const mongoose = require('mongoose');
require("dotenv").config();
const mongoURI = process.env.MONGODB_URL;
const connectToMongo = async()=>{
    try {
        mongoose.connect(mongoURI);
        console.log("Connected to MongoDB Database");
    } catch (error) {
        console.log(error);
    }
}

module.exports=connectToMongo;