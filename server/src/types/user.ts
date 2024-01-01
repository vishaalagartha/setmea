interface IUser {
  username: string
  password: string
  identity: 'climber' | 'setter' | 'admin' | 'superuser'
  comparePassword: (plainTextPassword: string) => boolean
  location: string
  email: string
  height: number
  weight: number
  apeIndex: number
  avatar: string
}

export type { IUser }
