import express from 'express'
const router = express.Router()

// import controllers
import { getAds, createAd, getAd, updateAd, deleteAd, saveAd } from '../controllers/ads.controller'

// api routes for interacting with ads
router.get('/', getAds)
router.post('/', createAd)
router.get('/:id', getAd)
router.put('/:id', updateAd)
router.post("/:userId/save-ad/:adId", saveAd)
router.delete('/:id', deleteAd)

export default router
