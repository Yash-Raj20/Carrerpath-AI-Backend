import { Schema, model } from "mongoose";

// ✅ Message schema (not nested inside 'messages')
const messageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
  },
  { _id: false } // optional: avoids extra _id for each message
);

// ✅ Chat schema
const chatSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [messageSchema], // ✅ Array of message objects
    chatType: { type: String },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);