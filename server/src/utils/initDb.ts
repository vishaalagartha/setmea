import mongoose from 'mongoose'
import User from '../models/user'

const MONGO_ENDPOINT =
  process.env.NODE_ENV === 'production' ? process.env.MONGO_PROD : process.env.MONGO_DEV

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@${MONGO_ENDPOINT}?retryWrites=true&w=majority`

const init: () => Promise<void> = async () => {
  try {
    const user = await User.findOne({ identity: 'admin' })
    if (user === null) {
      const admin = new User({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PW,
        email: process.env.ADMIN_EMAIL,
        identity: 'admin'
      })
      await admin.save()
    }
  } catch (e) {
    console.error('Failed to initialize DB with error: ' + JSON.stringify(e))
  }
}

const connect: () => void = () => {
  void (async () => {
    try {
      await mongoose.connect(MONGO_URL)
      console.log('Connected to MongoDB server')
      await init()
    } catch (error) {
      console.error(error)
    }
  })()
}

export { connect }
