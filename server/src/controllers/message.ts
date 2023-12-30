import Message from '../models/message'

const createMessage: (sender: string, receiver: string, content: string) => Promise<any> = async (sender: string, receiver: string, content: string) => {
  const message = new Message({ sender, receiver, content })
  await message.save()
  return message
}

const readMessage: (id: string) => Promise<any> = async (id: string) => {
  const message = await Message.findByIdAndUpdate(id, { read: true })
  return message
}

const modifyMessage: (id: string, content: string) => Promise<any> = async (id: string, content: string) => {
  const message = await Message.findByIdAndUpdate(id, { content })
  return message
}

const getMessagesBySender: (sender: string) => Promise<any> = async (sender: string) => {
  const messages = await Message.find({ sender })
  return messages
}

const getMessagesByReceiver: (receiver: string) => Promise<any> = async (receiver: string) => {
  const messages = await Message.find({ receiver })
  return messages
}

export {
  getMessagesBySender,
  getMessagesByReceiver,
  createMessage,
  modifyMessage,
  readMessage
}
