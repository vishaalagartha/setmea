import request from '../utils/request'

interface GymProps {
  name: string
  address: string
  city: string
  state: string
}

const getGyms = async (): Promise<any> => {
  try {
    const res = await request('gyms', {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const createGym = async ({ name, address, city, state }: GymProps): Promise<any> => {
  try {
    const res = await request('gyms', {
      method: 'POST',
      body: JSON.stringify({ name, address, city, state })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createGym, getGyms }
