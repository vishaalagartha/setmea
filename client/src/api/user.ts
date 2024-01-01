import request from '../utils/request'

const getUsersByIdentity = async (identity: string): Promise<any> => {
  try {
    const res = await request(`users?identity=${identity}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const deleteUser = async (userId: string): Promise<any> => {
  try {
    const res = await request(`users/${userId}`, {
      method: 'DELETE'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const editUser = async (
  userId: string,
  username: string,
  email: string,
  location: string,
  height: number,
  weight: number,
  apeIndex: number
): Promise<any> => {
  try {
    const res = await request(`users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ username, email, location, height, weight, apeIndex })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { deleteUser, getUsersByIdentity, editUser }
