interface IMessage {
  sender: string
  receiver: string
  content: string
  read: boolean
  date: Date
  expireAt: Date
}

export type { IMessage }
