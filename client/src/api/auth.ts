import request from '../utils/request'

interface RegistrationProps {
  username: string
  password: string
  identity: string
}

interface AuthProps {
  username: string
  password: string
}
interface FetchUserProps {
  uid: string
}

const register = async ({ username, password, identity }: RegistrationProps): Promise<any> => {
  try {
    const res = await request('register', {
      method: 'POST',
      body: JSON.stringify({ username, password, identity })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const login = async ({ username, password }: AuthProps): Promise<any> => {
  try {
    const res = await request('login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const fetchUser = async ({ uid }: FetchUserProps): Promise<any> => {
  try {
    const res = await request(`users/${uid}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { register, login, fetchUser }
