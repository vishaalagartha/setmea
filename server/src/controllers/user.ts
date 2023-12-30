import User from '../models/user'

const getUsers: () => Promise<any> = async () => {
  const users = await User.find()
  return users
}

const getUserById: (id: string) => Promise<any> = async (id: string) => {
  const user = await User.findById(id)
  return user
}

const createUser: (username: string, password: string, identity: string) => Promise<any> = async (
  username: string,
  password: string,
  identity: string
) => {
  const user = new User({ username, password, identity })
  // Save the user document to the database
  await user.save()
  return user
}

export { getUsers, getUserById, createUser }
