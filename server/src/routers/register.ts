import type { Request, Response, RequestHandler } from 'express'
import { Router } from 'express'
import { generate } from '../utils/auth-helpers'
import User from '../models/user'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'

const router = Router()

router.post('/', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { username, password, identity, email, userId } = req.body as {
      username: string
      password: string
      identity: string
      email: string
      userId: string
    }
    // Check if the andrewId is already taken
    const existingUser = await User.findOne({ username })
    if (existingUser !== null) {
      return res.status(409).json({
        message: 'Username is already taken'
      })
    }

    // Only admins can make other admins or setters
    if (identity !== 'climber') {
      const creator = await User.findById(userId)
      if (creator === null || creator.identity !== 'admin') return res.status(401).json({ message: 'Insufficient privileges.' })
    }

    const user = new User({ username, password, identity, email })
    await user.save()
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
