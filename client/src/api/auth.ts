import request from '../utils/request'

interface RegistrationProps {
  username: string
  password: string
  identity: string
  email: string
}

interface AuthProps {
  username: string
  password: string
}
interface FetchUserProps {
  uid: string
}

const register = async ({
  username,
  password,
  identity,
  email
}: RegistrationProps): Promise<any> => {
  try {
    const res = await request('register', {
      method: 'POST',
      body: JSON.stringify({ username, password, identity, email })
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

const requestResetPassword = async (email: string): Promise<any> => {
  try {
    const res = await request(`password?email=${email}`, {
      method: 'PUT'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const resetPassword = async (userId: string, password: string): Promise<any> => {
  try {
    const res = await request(`password`, {
      method: 'PATCH',
      body: JSON.stringify({ userId, password })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { register, login, fetchUser, requestResetPassword, resetPassword }
