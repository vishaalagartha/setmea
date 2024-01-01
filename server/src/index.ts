import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import routers from './routers'
import { init } from './utils/initDb'
import 'dotenv/config'

const app = express()

app.use(
  cors({
    credentials: true
  })
)

app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080')
})

const MONGO_URL =
  'mongodb+srv://vishaalagartha:ilostmylaptop123@setmea-cluster.5fzacie.mongodb.net/?retryWrites=true&w=majority'
const connect: () => Promise<void> = async () => {
  try {
    await mongoose.connect(MONGO_URL)
  } catch (error) {
    console.error(error)
  }
}
connect()
  .then(async () => {
    console.log('Connected to MongoDB server')
    await init()
  })
  .catch((error) => {
    console.error(error)
  })

app.use('/', routers)
