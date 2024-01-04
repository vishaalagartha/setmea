import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import routers from './routers'
import 'dotenv/config'
import { connect } from './utils/initDb'

const app = express()

const port = process.env.PORT ?? 8080

app.use(
  cors({
    credentials: true
  })
)

app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

connect()

app.use('/', routers)
