import type { RequestHandler, Request, Response } from 'express'
import { Router } from 'express'
import type { State } from '../types/gym'
import {
  createGym,
  getGyms,
  editGym,
  deleteGym,
  addGymZone,
  deleteGymZone
} from '../controllers/gym'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'
import User from '../models/user'

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
router.post('/', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { name, address, city, state, userId } = req.body as {
      name: string
      address: string
      city: string
      state: State
      userId: string
    }
    const creator = await User.findById(userId)
    // Only admins can create gyms
    if (creator === null || creator.identity !== 'admin') {
      res.status(401).json({ message: 'Insufficient privileges.' }).end()
      return
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

// PUT Gym
router.put('/:id', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, address, city, state, userId } = req.body as {
      name: string
      address: string
      city: string
      state: State
      userId: string
    }
    const editor = await User.findById(userId)
    // Only admins can edit create gyms
    if (editor === null || editor.identity !== 'admin') {
      res.status(401).json({ message: 'Insufficient privileges.' }).end()
      return
    }
    const gym = await editGym(id, name, address, city, state)
    res.status(200).json(gym.toObject()).end()
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

// POST Gym zone
router.post('/:id/zones', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { zone, userId } = req.body as {
      zone: string
      userId: string
    }
    const editor = await User.findById(userId)
    // Only admins can edit create gyms
    if (editor === null || editor.identity !== 'admin') {
      res.status(401).json({ message: 'Insufficient privileges.' }).end()
      return
    }
    const gym = await addGymZone(id, zone)
    res.status(200).json(gym.toObject()).end()
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

// DELETE Gym zone
router.delete('/:id/zones', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { zone, userId } = req.body as {
      zone: string
      userId: string
    }
    const editor = await User.findById(userId)
    // Only admins can edit create gyms
    if (editor === null || editor.identity !== 'admin') {
      res.status(401).json({ message: 'Insufficient privileges.' }).end()
      return
    }
    const gym = await deleteGymZone(id, zone)
    res.status(200).json(gym.toObject()).end()
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

// DELETE Gym
router.delete('/:id', (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const gym = await deleteGym(id)
    res.status(200).json(gym.toObject()).end()
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
