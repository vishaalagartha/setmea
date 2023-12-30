import type express from 'express'
import { Router } from 'express'
import type { RequestHandler } from 'express'
import User from '../models/user'
import { getUserById } from '../controllers/user'

const router = Router()

// GET user by user id
router.get('/:id/', (async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const user = await getUserById(id)
    if (user === null || user === undefined || !(user instanceof User)) {
      res.status(404).json({ message: 'User not found' }).end()
      return
    }
    const { password: _, ...fieldsToReturn } = user.toObject()
    res
      .status(200)
      .json({ ...fieldsToReturn })
      .end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: 'Error finding user',
        error
      })
      .end()
  }
}) as RequestHandler)

export default router
