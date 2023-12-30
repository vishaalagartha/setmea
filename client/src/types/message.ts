interface IMessage {
  _id: string
  sender: string
  receiver: string
  senderUsername: string
  content: string
  read: boolean
  date: string
}

export type { IMessage }
