import mongoose, { Schema, Document, ObjectId } from 'mongoose'

// interface for users
export interface IUser extends Document {
  username: string
  first_name: string
  last_name: string
  birthday: Date,
  age: number
  email: string
  password: string
  ads: ObjectId[]
  saved_ads: ObjectId[]
  posts: ObjectId[]
}

// mongoose schema for users
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ad' }],
  saved_ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Saved_ad' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }]
})

// registers a User model in database
const User = mongoose.model<IUser>('User', userSchema)

export default User
