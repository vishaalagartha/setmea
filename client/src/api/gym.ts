import request from '../utils/request'

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
interface CreateGymProps {
  name: string
  address: string
  city: string
  state: string
}

const createGym = async ({ name, address, city, state }: CreateGymProps): Promise<any> => {
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

interface EditGymProps {
  id: string
  name: string
  address: string
  city: string
  state: string
}

const editGym = async ({ id, name, address, city, state }: EditGymProps): Promise<any> => {
  try {
    const res = await request(`gyms/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, address, city, state })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

interface DeleteGymProps {
  id: string
}

const deleteGym = async ({ id }: DeleteGymProps): Promise<any> => {
  try {
    const res = await request(`gyms/${id}`, {
      method: 'DELETE'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const addGymZone = async (id: string, zone: string): Promise<any> => {
  try {
    const res = await request(`gyms/${id}/zones`, {
      method: 'POST',
      body: JSON.stringify({ zone })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const deleteZone = async (id: string, zone: string): Promise<any> => {
  try {
    const res = await request(`gyms/${id}/zones`, {
      method: 'DELETE',
      body: JSON.stringify({ zone })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createGym, getGyms, editGym, deleteGym, addGymZone, deleteZone }
