import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const connectDB=async()=>{
    try{
   const uri=process.env.MONGO_URI;
  const connect=await mongoose.connect(uri);
  console.log("mongoose connect");
    }catch(err){
        console.log(err)
    }
}