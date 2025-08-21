import mongoose from "mongoose";
import UserModel from "../models/Auth.model.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const Register = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  const token = jwt.sign(
    { id: newUser ._id, },
    process.env.JWT_SECRET,
    
  );

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
    token
  });
});

export const Login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await UserModel.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  const token = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // ✅ Set token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in prod
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  // ✅ Return success response
  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    },
  });
});




export const Logout = expressAsyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });

  res.status(200).json({ message: "Logged out successfully" });
});
