import mongoose, { Schema, Document } from 'mongoose'

// interface for posts
interface IPost extends Document {
  city: string
  title?: string
  text: string
  full_name: string
  user: mongoose.Schema.Types.ObjectId
}

// mongoose schema for posts
const postSchema = new Schema<IPost>(
  {
    city: { type: String, required: true },
    title: { type: String },
    text: { type: String, required: true },
    full_name: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add the reference to User*/
  },
  { timestamps: true }
)

// registers a Post model in database
const Post = mongoose.model<IPost>('Post', postSchema)

export default Post
