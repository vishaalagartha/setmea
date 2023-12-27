import express from 'express'
import register from './register'
import login from './login'
import users from './users'

export default express.Router().use('/register', register).use('/login', login).use('/users', users)
