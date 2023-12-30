import request from '../utils/request'

const getReceiverMessages = async (receiver: string): Promise<any> => {
  try {
    const res = await request(`messages?receiver=${receiver}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const sendMessage = async (receiver: string, content: string): Promise<any> => {
  try {
    const res = await request('messages', {
      method: 'POST',
      body: JSON.stringify({ receiver, content })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const readMessage = async (id: string): Promise<any> => {
  try {
    const res = await request(`messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read: true })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { getReceiverMessages, sendMessage, readMessage }
