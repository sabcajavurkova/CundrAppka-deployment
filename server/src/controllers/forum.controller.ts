import { Request, Response, RequestHandler, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'

import Post from '../models/forum-post.model'
import User from '../models/users.model'
import mongoose from 'mongoose'

// list of cities included in CundrAppka
const cities: string[] = [
    'Praha', 
    'Brno', 
    'Ostrava', 
    'Plzen',
    'Liberec',
    'Olomouc',
    'Ceske-Budejovice',
    'Hradec-Kralove',
    'Zlin',
    'Pardubice'
]

// fetches all posts under a particular city
// @route GET /api/forum/posts/:city
export const getCityPosts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
      // gets city that is part of the url
      const { city } = req.params
      // if city isn't registered in CundrAppka let frontend know
      if (!cities.includes(city)) {
          res.status(404).json({ success: false, message: 'K tomuto městu není fórum' })
          return
      }
  
      // fetch all the posts that were posted under the certain city
      const posts = await Post.find({city: city})

      // success, sends data to frontend
      if(posts){
        res.status(200).json({ success: true, data: posts })
        return
      }
    } catch (error) {
      // if anything goes wrong it si server's fault - status 500 is sent to frontend
      res.status(500).json({ success: false, message: 'Při načítání příspěvku nastala chyba' })
    }
})

// fetches all posts in db no matter the city
// @route GET /api/forum/posts
export const getAllPosts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    // empty condition {} is true for all objects in database of type Post
    const posts = await Post.find({})

    // if succesful or unsuccesful, send that info to frontend

    if(posts){
        res.status(200).json({ success: true, data: posts })
        return
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Při načítání prispevku nastala chyba' })
  }
})

// creates a post
// @route POST /api/forum
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        // extract ad data from the request body
        const { city, title, text } = req.body
        // retrieves the authenticated user's ID from the session
        const authenticatedUserId = req.session.userId
                // finds particular user by id, including email, returns a promise
        const user = await User.findById(authenticatedUserId).select('+email').exec()
    
        // make sure that the required fields are filled out
        if (!city || !text ) {
          res.status(400).json({ success: false, message: 'city a text jsou potreba vyplnit' })
          return
        }
    
        // create a new post instance with the provided data
        const newPost = new Post({
          city,
          title,
          text,
          full_name: `${user?.first_name} ${user?.last_name}`,
          user: authenticatedUserId
        })
    
        // save the post to the database
        const savedPost = await newPost.save()
        await User.findByIdAndUpdate(
            user?._id, 
            { $push: { posts: newPost._id as string } }, 
            { new: true }
        )
    
        // if succesful let frontend know
        if(savedPost){
            res.status(201).json({success: true, data: savedPost})
        }
      } catch (err) {
        // if unsuccesful let frontend know
        res.status(500).json({ success: false, message: 'Error creating post' })
      }
}

// deletes a post
// @route DELETE /api/forum/:id
export const deletePost: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    // gets ID that is part of the url
    const { id } = req.params

    // if post with such ID does not exist, throw a 404 error as in 'file not found'
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: 'Prispevek se zadaným ID neexistuje' })
      return
    }
  
    // finds ad by ID and deletes it
    const deletedPost = await Post.findByIdAndDelete(id)
  
     // if succesful or unsuccesful, send that info to frontend

    if(deletedPost){
      res.status(200).json({ success: true, message: 'Prispevek úspěšně smazán' })
      return
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Prispevek se nepodařilo smazat' })
  }
})