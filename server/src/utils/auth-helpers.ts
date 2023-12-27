import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET === '' ? 'jwt_secret' : process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN === '' ? '1d' : process.env.JWT_EXPIRES_IN

const generate: (uid: string) => string = (uid: string) => {
  return jwt.sign({ uid }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

const validate: (token: string) => jwt.JwtPayload | null = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    console.error(err)
    return null
  }
}

export { generate, validate }
