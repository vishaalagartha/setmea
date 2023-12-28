interface IUser {
  username: string
  password: string
  identity: 'climber' | 'setter'
  comparePassword: (plainTextPassword: string) => boolean
}

export type { IUser }
