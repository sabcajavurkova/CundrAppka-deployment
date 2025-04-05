import mongoose from 'mongoose'

// in the package express-session I'm expanding interface SessionData by an attribute userId
declare module 'express-session' {
    interface SessionData {
        userId: mongoose.Types.ObjectId
    }
}