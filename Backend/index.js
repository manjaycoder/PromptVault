import express from "express"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'

import Auth from "./routes/Auth.routes.js"
import connectDb from "./config/db.js"
dotenv.config()
const app=express()
//middleware
connectDb()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const PORT=process.env.PORT||  3000
app.use('/',Auth)

app.listen(PORT,()=>{
  console.log("Server is running")
})
