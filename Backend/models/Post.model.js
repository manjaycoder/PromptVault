import mongoose from "mongoose";

const PostSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
    trim:true
  },
  content: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    enum: ['text', 'code', 'markdown','JSON', 'Notion', 'PDF'],
    default: 'text',
  },
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  isPublic:{
type:Boolean,
default:false
  },
 vaultType: {
  type: String,
  enum: ['personal', 'community'],
  default: 'personal'
}
,
  tags:[
    {
      type:String,
      lowercase:true
    }
  ],
 
  category: {
  type: String,
  enum: ['ChatGPT', 'Code', 'Design', 'Marketing'],
  required: true
}
,
   exportFormats: {
    type: [String],
    enum: ['JSON', 'Notion', 'PDF'],
    default: ['JSON'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },


})

const PostModel=mongoose.model('Post',PostSchema)
export default PostModel
