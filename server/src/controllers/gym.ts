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

export { getGyms, createGym }
