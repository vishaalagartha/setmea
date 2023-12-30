import type { RequestHandler, Request, Response } from 'express'
import { Router } from 'express'
import type { State } from '../types/gym'
import { createGym, getGyms } from '../controllers/gym'

const router = Router()

// GET all Gyms
router.get('/', (async (req: Request, res: Response) => {
  try {
    const gyms = await getGyms()
    res.status(200).json(gyms).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: error.message
      })
      .end()
  }
}) as RequestHandler)

// POST Gym
router.post('/', (async (req: Request, res: Response) => {
  try {
    const { name, address, city, state } = req.body as {
      name: string
      address: string
      city: string
      state: State
    }
    const gym = await createGym(name, address, city, state)
    res.status(201).json(gym.toObject()).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: error.message
      })
      .end()
  }
}) as RequestHandler)

export default router
