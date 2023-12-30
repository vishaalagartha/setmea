interface IMessage {
  sender: string
  receiver: string
  content: string
  read: boolean
  date: Date
}

export type { IMessage }
