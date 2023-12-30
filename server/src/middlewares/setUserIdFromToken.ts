import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { validate } from '../utils/auth-helpers'

const setUserIdFromToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the authentication token from the request header.
  const authHeader = req.header('authorization')
  if (authHeader !== undefined) {
    // Extract the token value from the header.
    const token = authHeader.split(' ')[1]

    // Validate the token to get the decoded payload, which includes the user ID.
    const decodedToken = validate(token) as { uid: string }

    // Set the user ID in the request body for use in subsequent middleware or route handlers.
    req.body.userId = decodedToken.uid
  }
  next()
}

export default setUserIdFromToken
