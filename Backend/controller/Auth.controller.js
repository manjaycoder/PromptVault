import mongoose from "mongoose";
import UserModel from "../models/Auth.model.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
export const Register=expressAsyncHandler(async (req,res)=>{
const {username,email,password}=req.body;
if(!username || !email || !password){
   return res.status(400).json({ message: "All fields are required" });
}
const existingUser=  await UserModel.findOne({$or :[
  {username},
  {email}
]});
if(existingUser){
  return res.status(400).json({message:"User alreday exist"})
}
const HashPassword=await bcrypt.hash(password,8)

const newUser=new UserModel({
  username,
  email,
  password:HashPassword
})
await newUser.save()
return res.status(400).json({message:"User created",user:newUser
  
})
})


export const Login=expressAsyncHandler(async (req,res)=>{
  const {email,password}=req.body
  if(!email || !password){
    return res.json({message:"Missing filled"})
  }
  const existingUser=await UserModel.findOne({
   email
  })
  if(!existingUser){
   return res.status(404).json({message:"UnAuthenication"})
  }
 const CamparePassword=await bcrypt.compare(password,existingUser.password)
 if(!CamparePassword){
   return res.status(401).json({ error: 'Authentication failed' });
 }
 const token=jwt.sign({id:existingUser._id},process.env.JWT_SECRET, {
  expiresIn:'1h',
 })
 res.status(200).json({ token,
  user:{
    id:existingUser._id,
    username:existingUser.username,
    email:existingUser.email
  }
  });
 } 
 
)
export const logout=expressAsyncHandler(async(req,res)=>{
  res.cookie("jwt","",{
    httpOnly:true,
    expires:new Date(0)
  })
  res.status(200).json({ message: "Logged out successfully" });
})
