import mongoose, { ObjectId } from 'mongoose'
import { Request, Response, RequestHandler, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'

import Ad from '../models/ads.model'
import User from '../models/users.model'

// fetches all ads in db
// @route GET /api/ads
export const getAds: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    // gets all ads, since the condition {} is empty
    const ads = await Ad.find({})
    if(ads){
        // succes, sends data to frontend
        res.status(200).json({ success: true, data: ads })
        return
    }
  } catch (error) {
    // status 500 - server error while fetching ads
    res.status(500).json({ success: false, message: 'Při načítání inzerátů nastala chyba' })
  }
})

// fetches a single ad
// @route GET /api/ads/:id
export const getAd: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    // gets ID that is part of the url
    const { id } = req.params

    // if ad with such ID does not exist, send that info to frontend
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: 'Inzerát se zadaným ID neexistuje' })
      return
	  }
 
    // finds the particular ad
    const ad = await Ad.findById({_id: id})

    if(ad){
        // success, sends data to frontend
        res.json({ success: true, data: ad })
        return
    }
  } catch (error) {
    // if anything goes wrong it si server's fault - status 500 is sent to frontend
    res.status(500).json({ success: false, message: 'Při načítání inzerátu nastala chyba' })
  }
})

// creates an ad
// @route POST /api/ads
export const createAd = async (req: Request, res: Response): Promise<void> => {
    try {
        // request body constains ad info
        const { title, description, phone, destination, date, preferences } = req.body
        // retrieves the authenticated user's ID from the session
        const authenticatedUserId = req.session.userId
        // finds particular user by id, including email, returns a promise
        const user = await User.findById(authenticatedUserId).select('+email').exec()

        // make sure that the required fields are filled out
        if (!title || !description ) {
          res.status(400).json({ success: false, message: 'Nadpis a popisek inzerátu chybí' })
          return
        }
    
        // create a new ad instance with the provided data
        const newAd = new Ad({
          title,
          description,
          phone,
          destination,
          date,
          preferences,
          full_name: `${user?.first_name} ${user?.last_name}`,
          email: user?.email,
          user: authenticatedUserId,
          user_age: user?.age
        })
    
        // saves ad to the database
        const savedAd = await newAd.save()
        // push user's new ad to his attribute ads
        await User.findByIdAndUpdate(
            user?._id, 
            { $push: { ads: newAd._id as string } }, 
            { new: true }
        )
    
        // if succesful let frontend know
        if(savedAd){
          res.status(201).json({success: true, data: savedAd})
        }
      } catch (err) {
        // if unsuccesful let frontend know
        res.status(500).json({ success: false, message: 'Při vytváření inzerátů nastala chyba' })
      }
}

// updates an already existing ad
// @route PUT /api/ads/:id
export const updateAd: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    // gets ID that is part of the url
    const { id } = req.params
    // gets ad object that is part of the body
    const ad = req.body

    // if user is trying to edit an ad that does not exist
    if (!mongoose.Types.ObjectId.isValid(id)) {
		  res.status(404).json({ success: false, message: 'Inzerát se zadaným ID neexistuje' })
      return
	  }

    // find the ad by ID and update it
    const updatedAd = await Ad.findByIdAndUpdate(id, ad, { new: true })

    // if succesful or unsuccesful, send that info to frontend

    if(updatedAd){
        res.status(200).json({ success: true, data: updatedAd })
        return
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Při úpravě inzerátu nastala chyba' })
  }
})

// deletes an ad
// @route DELETE /api/ads/:id
export const deleteAd: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    // gets ID that is part of the url
    const { id } = req.params

    // if ad with such ID does not exist, throw a 404 error as in 'file not found'
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: 'Inzerát se zadaným ID neexistuje' })
      return
    }

    // finds ad by ID and deletes it
    const deletedAd = await Ad.findByIdAndDelete(id)

    // if succesful or unsuccesful, send that info to frontend

    if (deletedAd){
      res.status(200).json({ success: true, message: 'Inzerát úspěšně smazán' })
      return
    }
  } catch(error) {
    res.status(500).json({ success: false, message: 'Inzerát se nepodařilo smazat' })
  }
})

// saves or unsaves an ad
// @route POST /api/ads/:userId/save-ad/:adId
export const saveAd: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    // gets user, ad ID that are part of the url
    const { userId, adId } = req.params

    // gets particular user
    const user = await User.findById(userId)

    // if user does not exist
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" })
      return
    }

    // since comparing database IDs I convert it to a proper format
    const adObjectId = new mongoose.Types.ObjectId(adId)

    // compare saved_ads as string representations of ObjectIds
    const isAlreadySaved = user.saved_ads.some(savedAdId => savedAdId.toString() === adObjectId.toString())

    // if already saved, unsave it = remove from user's saved_ads
    if (isAlreadySaved) {
      user.saved_ads = user.saved_ads.filter(savedAdId => savedAdId.toString() !== adObjectId.toString()) // Compare as strings
    } else {
      // adding to user's saved_ads
      user.saved_ads.push(adObjectId as unknown as ObjectId) 
    }

    // save the updated user document
    const saved_ad = await user.save()

    // if succesful or unsuccesful, send that info to frontend

    if(saved_ad) {
      res.json({ success: true, saved_ads: user.saved_ads })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error })
  }
})




