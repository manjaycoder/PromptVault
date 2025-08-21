import mongoose from "mongoose";

const ExportJobSchema = new mongoose.Schema({
  prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' },
  format: { type: String, enum: ['JSON', 'Notion', 'PDF'] },
  status: { type: String, default: 'pending' },
  downloadLink: String,
});

const Export=mongoose.model('ExportJob',ExportJobSchema)
export default Export
