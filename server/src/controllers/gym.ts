import type { State } from 'types/gym'
import Gym from '../models/gym'

const getGyms: () => Promise<any> = async () => {
  const gyms = await Gym.find()
  return gyms
}

const createGym: (
  name: string,
  address: string,
  city: string,
  states: State
) => Promise<any> = async (name: string, address: string, city: string, state: State) => {
  const existingGym = await Gym.findOne({ name })
  if (existingGym !== null) {
    throw new Error('Gym already exists.')
  }
  const gym = new Gym({ name, address, city, state })
  await gym.save()

  return gym
}

const editGym: (
  id: string,
  name: string,
  address: string,
  city: string,
  states: State
) => Promise<any> = async (
  id: string,
  name: string,
  address: string,
  city: string,
  state: State
) => {
  const gym = await Gym.findByIdAndUpdate(id, { name, address, city, state })
  return gym
}

const addGymZone: (id: string, zone: string) => Promise<any> = async (id: string, zone: string) => {
  const gym = await Gym.findById(id)
  if (gym !== null) {
    gym.zones.push(zone)
    await gym.save()
    return gym
  }
  throw new Error('Invalid gym id.')
}

const deleteGymZone: (id: string, zone: string) => Promise<any> = async (
  id: string,
  zone: string
) => {
  const gym = await Gym.findById(id)
  if (gym !== null) {
    gym.zones = gym.zones.filter((z) => z !== zone)
    await gym.save()
    return gym
  }
  throw new Error('Invalid gym id.')
}

const deleteGym: (id: string) => Promise<any> = async (id: string) => {
  const res = await Gym.findByIdAndDelete(id)
  return res
}

export { getGyms, createGym, editGym, deleteGym, addGymZone, deleteGymZone }
