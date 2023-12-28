import express from 'express'
import register from './register'
import login from './login'
import users from './users'
import gyms from './gyms'

export default express.Router().use('/register', register).use('/login', login).use('/users', users).use('/gyms', gyms)
