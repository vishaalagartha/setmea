import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_ROUNDS =
  process.env.SALT_ROUNDS === '' || process.env.SALT_ROUNDS === null || process.env.SALT_ROUNDS === undefined
    ? 10
    : process.env.SALT_ROUNDS

interface IUser {
  username: string
  password: string
  comparePassword: (plainTextPassword: string) => boolean
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String },
})

UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      if (this.password === null || this.password === undefined) this.password = ''
      const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS)
      this.password = hashedPassword
    }
    next()
  } catch (error) {
    if (error instanceof NativeError) next(error)
  }
})

UserSchema.methods.comparePassword = async function (plainTextPassword: string) {
  // eslint-disable-next-line
  const passwordMatch = await bcrypt.compare(plainTextPassword, this.password)
  return passwordMatch
}

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
