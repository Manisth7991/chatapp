import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  wa_id: String,
  name: String,
  msg_id: { type: String, unique: true },
  text: String,
  timestamp: Date,
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent"
  }
}, {
  timestamps: true,
  collection: 'processed_messages' // Explicitly set collection name
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
