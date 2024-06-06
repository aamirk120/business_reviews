const router = require('express').Router()

exports.router = router

const BusinessModel = require('../models/business.model')
const PhotoModel = require('../models/photo.model')
const ReviewModel = require('../models/review.model')


/*
 * Route to list all of a user's businesses.
 */
router.get('/:userid/businesses', async function (req, res) {
  const { userid } = req.params
  const userBusinesses = await BusinessModel.find({ ownerid: userid }).lean(true)
  res.status(200).send({
    businesses: userBusinesses
  })
})

/*
 * Route to list all of a user's reviews.
 */
router.get('/:userid/reviews', async function (req, res) {
  const { userid } = req.params
  const userReviews = await ReviewModel.find({ userid }).lean(true)

  res.status(200).send({
    reviews: userReviews
  })
})

/*
 * Route to list all of a user's photos.
 */
router.get('/:userid/photos', async function (req, res) {
  const { userid } = req.params
  const userPhotos = await PhotoModel.find({ userid }).lean(true)
  res.status(200).send({
    photos: userPhotos
  })
})
