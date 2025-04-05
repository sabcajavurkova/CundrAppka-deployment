// import modules
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import path from 'path'

import { connectDB } from './config/db'
import adRoutes from './routes/ads.route'
import userRoutes from './routes/users.route'
import forumRoutes from './routes/forum.route'

// configuring dotenv and db
dotenv.config()
connectDB()

// initializing app
const app = express()

const server_dir = path.resolve();
const __dirname = path.resolve(server_dir, '..')

// middleware
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// session management
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000 // lasts an hour
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    })
}))

// registering routes
app.use('/api/ads', adRoutes)
app.use('/api/users', userRoutes)
app.use('/api/forum', forumRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
} else {
  // endpoint not found
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({ message: 'Endpoint neexistuje' })
  })
}

// listening on port
const PORT: number = parseInt(process.env.PORT || '8000', 10)
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`))

export default app
