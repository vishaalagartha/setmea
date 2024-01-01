import type express from 'express'
import { Router } from 'express'
import type { RequestHandler } from 'express'
import User from '../models/user'
import { generate } from '../utils/auth-helpers'
import { sendMail } from '../utils/email'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'
const router = Router()

// GET users identity
router.get('/', (async (req: express.Request, res: express.Response) => {
  try {
    const { identity } = req.query
    const users = identity !== null ? await User.find({ identity }) : await User.find()
    const data = users.map((u) => {
      const { password: _, ...fieldsToReturn } = u.toJSON()
      return fieldsToReturn
    })
    res
      .status(200)
      .json(data)
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

// GET user by user id
router.get('/:id/', (async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
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

// PUT user password by email
router.put('/:id', (async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const fields = req.body as {
      username: string
      email: string
      location: string
      height: number
      bodyweight: number
      apeIndex: number
    }
    const user = await User.findByIdAndUpdate(id, fields, { new: true })
    if (user === null || user === undefined || !(user instanceof User)) {
      res.status(404).json({ message: 'User id not found.' }).end()
      return
    }
    const { password: _, ...fieldsToReturn } = user.toObject()
    res.status(200).json({ ...fieldsToReturn }).end()
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

// PUT user password by email
router.put('/password', (async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.query as { email: string }
    const user = await User.find({ email })
    if (user === null || user === undefined || !(user instanceof User)) {
      res.status(404).json({ message: 'User with email not found' }).end()
      return
    }
    const token = generate(user._id.toString())
    const emailStatus = await sendMail(email, token, user.username, user._id.toString())
    // eslint-disable-next-line
    if (emailStatus.accepted) {
      res.status(200).json({ message: 'Successfully sent reset email.' }).end()
      return
    }
    throw new Error('Email sending failed.')
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

// DELETE user by id
router.delete('/:id', setUserIdFromToken, (async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const deleter = await User.findById(userId)
    // Only admins can delete users
    if (deleter === null || deleter.identity !== 'admin') {
      res.status(401).json({ message: 'Insufficient privileges.' }).end()
      return
    }
    await User.findByIdAndDelete(id)
    res.status(200).json({ message: 'Deleted user.' }).end()
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
