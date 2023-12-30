import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { validate } from '../utils/auth-helpers'

const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  (() => {
    const authHeader = req.header('authorization')
    if (authHeader === '' || authHeader === undefined) {
      return res.status(401).json({ message: 'Missing authorization header.' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = validate(token)

    if (decoded === null) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }
    next()
  })()
}

export default authenticate
