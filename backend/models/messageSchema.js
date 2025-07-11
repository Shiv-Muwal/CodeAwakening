import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    minLength: [2, "Name Must Contain At Least 2 Characters!"],
    index: true,
  },
  subject: {
    type: String,
    minLength: [2, "Subject Must Contain At Least 2 Characters!"],
    index: true,
  },
  message: {
    type: String,
    minLength: [2, "Message Must Contain At Least 2 Characters!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: true,
  },
}, {
  timestamps: true,
  indexes: [
    { createdAt: -1 },
    { senderName: 1, createdAt: -1 },
  ]
});

messageSchema.index({ 
  senderName: 'text', 
  subject: 'text', 
  message: 'text' 
});

export const Message = mongoose.model("Message", messageSchema);
