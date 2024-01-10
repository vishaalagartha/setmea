import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import type { IUser } from '../types/user'

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    identity: { type: String, required: true, enum: ['climber', 'setter', 'admin', 'superuser'] },
    email: { type: String, required: true },
    height: { type: Number },
    apeIndex: { type: Number },
    weight: { type: Number },
    location: { type: String },
    avatar: { type: String }
  },
  {
    versionKey: false
  }
)
UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      if (this.password === undefined) {
        throw new Error('Invalid password')
      }
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
    next()
  } catch (error) {
    if (error instanceof Error) next(error)
  }
})

UserSchema.methods.comparePassword = async function (plainTextPassword: string) {
  // eslint-disable-next-line
  const passwordMatch = await bcrypt.compare(plainTextPassword, this.password)
  return passwordMatch
}

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel
