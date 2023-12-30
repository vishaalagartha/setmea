import mongoose from 'mongoose'
import { type IMessage } from '../types/message'

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
)

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema)

export default MessageModel
