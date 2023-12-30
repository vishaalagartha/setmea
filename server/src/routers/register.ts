import type { Request, Response, RequestHandler } from 'express'
import { Router } from 'express'
import { generate } from '../utils/auth-helpers'
import User from '../models/user'
import { createUser } from '../controllers/user'

const router = Router()

router.post('/', (async (req: Request, res: Response) => {
  try {
    const { username, password, identity } = req.body as {
      username: string
      password: string
      identity: string
    }
    // Check if the andrewId is already taken
    const existingUser = await User.findOne({ username })
    if (existingUser !== null) {
      return res.status(409).json({
        message: 'Username is already taken'
      })
    }

    const user = await createUser(username, password, identity)
    if (user instanceof User) {
      const token = generate(user._id.toString())
      const { password: _, ...fieldsToReturn } = user.toObject()
      // Return success response with the created user document
      return res.status(201).json({ token, ...fieldsToReturn })
    }
    throw new Error('Error creating user')
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: error.message
    })
  }
}) as RequestHandler)

export default router
