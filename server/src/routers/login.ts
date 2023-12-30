import type express from 'express'
import { Router } from 'express'
import type { RequestHandler } from 'express'
import User from '../models/user'
import { generate } from '../utils/auth-helpers'

const router = Router()

router.post('/', (async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user === null) {
      res.status(404).json({ message: 'User not found' }).end()
      return
    }
    if (typeof password !== 'string') {
      res.status(404).json({ message: 'Invalid credentials' }).end()
      return
    }
    const isPasswordVerified = user.comparePassword(password)
    if (!isPasswordVerified) {
      res.status(401).json({ message: 'Invalid credentials' }).end()
    }
    const token = generate(user._id.toString())
    const { password: _, ...fieldsToReturn } = user.toObject()
    res
      .status(200)
      .json({ token, ...fieldsToReturn })
      .end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' }).end()
  }
}) as RequestHandler)

export default router
