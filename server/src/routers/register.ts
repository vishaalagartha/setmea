import type { Request, Response, RequestHandler } from 'express'
import { Router } from 'express'
import { generate } from '../utils/auth-helpers'
import User from '../models/users'

const router = Router()

router.post('/', (async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    // Check if the andrewId is already taken
    const existingUser = await User.findOne({ username })
    if (existingUser !== null) {
      return res.status(409).json({
        message: 'Username is already taken',
      })
    }

    // Create a new user document
    const user = new User({ username, password })

    // Save the user document to the database
    await user.save()
    const token = generate(user._id.toString())
    const { password: _, ...fieldsToReturn } = user.toObject()
    // Return success response with the created user document
    return res.status(201).json({ token, ...fieldsToReturn })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error creating user',
      error,
    })
  }
}) as RequestHandler)

export default router
