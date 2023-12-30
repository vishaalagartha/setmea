import express from 'express'
import register from './register'
import login from './login'
import users from './users'
import gyms from './gyms'
import routes from './routes'
import messages from './messages'
import authenticate from '../middlewares/authenticate'

export default express
  .Router()
  .use('/register', register)
  .use('/login', login)
  .use('/users', authenticate, users)
  .use('/gyms', authenticate, gyms)
  .use('/routes', authenticate, routes)
  .use('/messages', messages)
