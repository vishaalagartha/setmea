export enum Identity {
  CLIMBER = 'climber',
  SETTER = 'setter',
  ADMIN = 'admin'
}

interface IUser {
  _id: string
  username: string
  location: string
  identity: Identity | undefined
  email: string
  height: number | undefined
  weight: number | undefined
  apeIndex: number | undefined
  avatar: string
}

export type { IUser }
