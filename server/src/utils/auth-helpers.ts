import jwt from 'jsonwebtoken'

const generate: (uid: string) => string = (uid: string) => {
  if (
    process.env.JWT_SECRET === null ||
    process.env.JWT_SECRET === undefined ||
    process.env.JWT_EXPIRES_IN === undefined
  ) {
    throw new Error('JWT_SECRET and JWT_EXPIRES_IN must be defined')
  }
  return jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const validate: (token: string) => string | jwt.JwtPayload | null = (token: string) => {
  try {
    if (process.env.JWT_SECRET === null || process.env.JWT_SECRET === undefined) {
      return null
    }
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return null
  }
}

export { generate, validate }
