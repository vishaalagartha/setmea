import express from 'express'
import register from './register'
import login from './login'
import password from './password'
import users from './users'
import gyms from './gyms'
import routes from './routes'
import messages from './messages'
import authenticate from '../middlewares/authenticate'

export default express
  .Router()
  .use('/healthcheck', (req, res) => { res.sendStatus(200).send('Setmea API') })
  .use('/register', register)
  .use('/login', login)
  .use('/password', password)
  .use('/users', authenticate, users)
  .use('/gyms', authenticate, gyms)
  .use('/routes', authenticate, routes)
  .use('/messages', authenticate, messages)
  .use('/', (req, res) => { res.sendStatus(200) })
