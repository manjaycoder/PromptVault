import mongoose from "mongoose";

const shareTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date, // ✅ FIXED (was wrongly "Now" before)
      default: null,
    },
    permission: {
      type: String,
      enum: ["view", "edit"],
      default: "view",
    },
  },
  { timestamps: true }
);

const ShareToken = mongoose.model("ShareToken", shareTokenSchema);

export default ShareToken;
