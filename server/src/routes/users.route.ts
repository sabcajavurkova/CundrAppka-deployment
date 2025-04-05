import express from 'express'
const router = express.Router()

// import controllers
import { getUser, registerUser, loginUser, logoutUser } from '../controllers/users.controller'

// api routes user authentication
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/', getUser)

export default router
