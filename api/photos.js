const router = require('express').Router()
const { validateAgainstSchema, extractValidFields } = require('../lib/validation')

const PhotoModel = require('../models/photo.model')

exports.router = router

/*
 * Schema describing required/optional fields of a photo object.
 */
const photoSchema = {
  userid: { required: true },
  businessid: { required: true },
  caption: { required: false }
}


/*
 * Route to create a new photo.
 */
router.post('/', async function (req, res, next) {
  if (validateAgainstSchema(req.body, photoSchema)) {
    const photo = extractValidFields(req.body, photoSchema)
    photo = await PhotoModel.create(business);

    res.status(201).send({
      id: photo.id,
      links: {
        photo: `/photos/${photo.id}`,
        business: `/businesses/${photo.businessid}`
      }
    })
  } else {
    res.status(400).send({
      error: "Request body is not a valid photo object"
    })
  }
})

/*
 * Route to fetch info about a specific photo.
 */
router.get('/:photoID', async function (req, res, next) {
  const { photoID } = req.params

  if (photoID) {
    const photo = await PhotoModel.findOne({ _id: photoID });
    res.status(200).send(photo)
  } else {
    next()
  }
})

/*
 * Route to update a photo.
 */
router.put('/:photoID', async function (req, res, next) {
  const { photoID } = req.params
  if (photoID) {

    if (validateAgainstSchema(req.body, photoSchema)) {
      /*
       * Make sure the updated photo has the same businessid and userid as
       * the existing photo.
       */
      const updatedPhoto = extractValidFields(req.body, photoSchema)
      const existingPhoto = await PhotoModel.findOne({ _id: photoID }, {}, { lean: true })
      if (existingPhoto && updatedPhoto.businessid === existingPhoto.businessid && updatedPhoto.userid === existingPhoto.userid) {
        await Photo.updateOne(
          { _id: photoID },
          updatedPhoto
        )
        res.status(200).send({
          links: {
            photo: `/photos/${photoID}`,
            business: `/businesses/${updatedPhoto.businessid}`
          }
        })
      } else {
        res.status(403).send({
          error: "Updated photo cannot modify businessid or userid"
        })
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid photo object"
      })
    }

  } else {
    next()
  }
})

/*
 * Route to delete a photo.
 */
router.delete('/:photoID', async function (req, res, next) {
  const { photoID } = req.params
  if (photoID) {
    await PhotoModel.deleteOne({ _id: photoID })
    res.status(204).end()
  } else {
    next()
  }
})
