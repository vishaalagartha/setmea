import mongoose from 'mongoose'
import { type IMessage } from '../types/message'

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    expireAt: {
      type: Date,
      default: Date.now,
      // Expiry after 7 days
      expires: 60 * 60 * 24 * 7
    }
  },
  {
    versionKey: false
  }
)

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema)

export default MessageModel
