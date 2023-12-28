import type { Request, Response, NextFunction } from 'express'
import { validate } from '../utils/auth-helpers'

const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any> = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('authorization')
  if (authHeader === '' || authHeader === undefined) {
    return res.status(401).send('Missing authorization header.')
  }
  const token = authHeader.split(' ')[1]
  const decoded = validate(token)

  if (decoded === null) {
    return res.status(401).send('Unauthorized.')
  }
  next()
}

export default authenticate
