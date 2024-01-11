import type express from 'express'
import { Router } from 'express'
import type { RequestHandler } from 'express'
import {
  createMessage,
  getMessagesByReceiver,
  getMessagesBySender,
  readMessage,
  modifyMessage
} from '../controllers/message'
import User from '../models/user'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'
import { type IMessage } from '../types/message'

const router = Router()

// POST messages by sender or receiver
router.get('/', (async (req: express.Request, res: express.Response) => {
  try {
    const { sender, receiver } = req.query as { sender: string | null; receiver: string | null }
    let messages = []
    if (sender !== undefined && sender !== null) {
      messages = await getMessagesBySender(sender)
    } else if (receiver !== undefined && receiver !== null) {
      messages = await getMessagesByReceiver(receiver)
    }
    const data = []
    for (const message of messages) {
      const sender = await User.findById(message.sender)
      const receiver = await User.findById(message.receiver)
      data.push({
        ...message.toObject(),
        senderUsername: sender?.username,
        receiverUsername: receiver?.username
      })
    }
    res.status(200).json({ messages: data }).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: 'Error finding user messages',
        error
      })
      .end()
  }
}) as RequestHandler)

// POST message
router.post('/', setUserIdFromToken, (async (req: express.Request, res: express.Response) => {
  try {
    const { userId, receiver, content } = req.body as {
      userId: string
      receiver: string
      content: string
    }
    const message = await createMessage(userId, receiver, content)
    res.status(201).json(message).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: 'Error finding user messages',
        error
      })
      .end()
  }
}) as RequestHandler)

// PATCH message
router.patch('/:id', setUserIdFromToken, (async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { read, content } = req.body as { read: boolean | undefined; content: string | undefined }
    let message: IMessage | null = null
    if (read === true) message = await readMessage(id)
    else if (content !== undefined) message = await modifyMessage(id, content)

    if (message !== null) {
      res.status(200).json(message).end()
    } else {
      res.status(400).json({ message: 'Invalid request to modify message.' })
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: 'Error finding user messages',
        error
      })
      .end()
  }
}) as RequestHandler)

export default router
