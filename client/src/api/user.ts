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
  apeIndex: number,
  avatar: string
): Promise<any> => {
  try {
    const res = await request(`users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ username, email, location, height, weight, apeIndex, avatar })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const updateAvatar = async (userId: string, file: File): Promise<any> => {
  try {
    const { type } = file as { type: string }
    const fileType = encodeURIComponent(type)
    const res = await request(`users/${userId}/avatar?fileType=${fileType}`, {
      method: 'PATCH'
    })
    if (res.status === 200) {
      const { url, key } = res.data as { url: string; key: string }
      // @ts-expect-error - TS does not expect originFileObj to exist on file type
      const putRes = await fetch(url, { method: 'PUT', body: file.originFileObj })
      return { res: putRes, key }
    } else {
      const { data } = res
      const { message } = data as { message: string }
      throw new Error(message)
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

export { deleteUser, getUsersByIdentity, editUser, updateAvatar }
