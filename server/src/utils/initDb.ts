import User from '../models/user'

const init: () => Promise<void> = async () => {
  try {
    const user = await User.findOne({ identity: 'admin' })
    if (user === null) {
      const admin = new User({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PW, email: process.env.ADMIN_EMAIL, identity: 'admin' })
      await admin.save()
    }
  } catch (e) {
    console.error('Failed to initialize DB with error: ' + JSON.stringify(e))
  }
}

export { init }
