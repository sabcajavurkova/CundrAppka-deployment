import mongoose, { Schema, Document } from 'mongoose'

// interface for ads
interface IAd extends Document {
  title: string
  description: string
  phone?: string
  destination?: string
  date?: string
  preferences?: {
    gender?: string
    minAge?: string
    maxAge?: string
    languages?: string[]
    smokingPreference?: string
  }
  full_name: string
  email: string
  user_age: number
  user: mongoose.Schema.Types.ObjectId
}

// mongoose schema for ads
const adSchema = new Schema<IAd>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String },
    destination: { type: String },
    date: { type: String },
    preferences: {
      gender: { type: String },
      minAge: { type: String },
      maxAge: { type: String },
      languages: [String],
      smokingPreference: { type: String },
    },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    user_age: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add the reference to User*/
  },
  { timestamps: true }
)

// registers an Ad model in database
const Ad = mongoose.model<IAd>('Ad', adSchema)

export default Ad
