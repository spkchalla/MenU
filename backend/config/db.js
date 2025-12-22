import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to mongo db");
})
.catch(err=>{
    console.error('Mongo connection failed:', err.message)
})