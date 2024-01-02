import type express from 'express'
import { Router } from 'express'
import type { RequestHandler } from 'express'
import User from '../models/user'
import { generate } from '../utils/auth-helpers'
import { sendMail } from '../utils/email'
import authenticate from '../middlewares/authenticate'

const router = Router()

// PUT user password by email
router.put('/', (async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.query as { email: string }
    const user = await User.findOne({ email })
    if (user === null || user === undefined || !(user instanceof User)) {
      res.status(404).json({ message: 'User with email not found' }).end()
      return
    }
    const token = generate(user._id.toString())
    const emailStatus = await sendMail(email, token, user.username, user._id.toString())
    if (emailStatus !== null) {
      res.status(200).json({ message: 'Successfully sent email.' })
    }
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

router.patch('/', authenticate, (async (req: express.Request, res: express.Response) => {
  try {
    const { password, userId } = req.body as { password: string, userId: string }
    const user = await User.findById(userId)
    if (user === null || user === undefined || !(user instanceof User)) {
      res.status(404).json({ message: 'User not found' }).end()
      return
    }
    user.password = password
    await user.save()
    res.status(200).json({ message: 'Successfully saved password.' })
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
