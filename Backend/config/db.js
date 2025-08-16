import mongoose from "mongoose";
const connectDb=async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`Successfully connect 👍`)
  } catch (error) {
    console.log(`Successfully connect to MongoDb`,error)
    process.exit(2)
  }
}

export default connectDb
