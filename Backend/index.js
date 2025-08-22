import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import Post from './routes/Post.routes.js'
import Auth from "./routes/Auth.routes.js"
import connectDb from "./config/db.js"
import Export from "./routes/Export.routes.js"

dotenv.config()
const app=express()
app.use(cors());

//middlewareclea
connectDb()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/Auth',Auth)
app.use("/api/export",Export)
app.use('/Post',Post)
app.listen(()=>{
  console.log("Server is running")
})
