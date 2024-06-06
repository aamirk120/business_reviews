const router = require('express').Router()
const { validateAgainstSchema, extractValidFields } = require('../lib/validation')

const ReviewModel = require('../models/review.model')


exports.router = router

/*
 * Schema describing required/optional fields of a review object.
 */
const reviewSchema = {
  userid: { required: true },
  businessid: { required: true },
  dollars: { required: true },
  stars: { required: true },
  review: { required: false }
}


/*
 * Route to create a new review.
 */
router.post('/', async function (req, res, next) {
  const { user } = req
  if (validateAgainstSchema(req.body, reviewSchema)) {

    const review = extractValidFields(req.body, reviewSchema)

    if (user.id !== review.userid) {
      return res.status(403).send({
        error: "not authorized"
      });
    }


    /*
     * Make sure the user is not trying to review the same business twice.
     */
    const userReviewedThisBusinessAlready = await ReviewModel.findOne(
      {
        userid: review.userid,
        businessid: review.businessid
      }
    ).lean(true);


    if (userReviewedThisBusinessAlready) {
      res.status(403).send({
        error: "User has already posted a review of this business"
      })
    } else {
      review = await ReviewModel.create(review)
      res.status(201).send({
        id: review.id,
        links: {
          review: `/reviews/${review.id}`,
          business: `/businesses/${review.businessid}`
        }
      })
    }

  } else {
    res.status(400).send({
      error: "Request body is not a valid review object"
    })
  }
})

/*
 * Route to fetch info about a specific review.
 */
router.get('/:reviewID', async function (req, res, next) {
  const { reviewID } = req.params
  if (reviewID) {
    const review = await ReviewModel.findOne({ _id: reviewID }).lean(true)
    res.status(200).send(review)
  } else {
    next()
  }
})

/*
 * Route to update a review.
 */
router.put('/:reviewID', async function (req, res, next) {
  const { reviewID } = req.params

  if (!reviewID) {
    return next()
  }

  if (!validateAgainstSchema(req.body, reviewSchema)) {
    return res.status(400).send({
      error: "Request body is not a valid review object"
    })
  }

  /*
  * Make sure the updated review has the same businessid and userid as
  * the existing review.
  */
  let updatedReview = extractValidFields(req.body, reviewSchema)
  const existingReview = await ReviewModel.findOne(
    {
      userid: updatedReview.userid,
      businessid: updatedReview.businessid
    }
  ).lean(true);


  if (updatedReview.businessid === existingReview.businessid && updatedReview.userid === existingReview.userid) {
    await ReviewModel.updateOne(
      { _id: reviewID },
      updatedReview
    )
    res.status(200).send({
      links: {
        review: `/reviews/${reviewID}`,
        business: `/businesses/${updatedReview.businessid}`
      }
    })
  } else {
    res.status(403).send({
      error: "Updated review cannot modify businessid or userid"
    })
  }

})

/*
 * Route to delete a review.
 */
router.delete('/:reviewID', async function (req, res, next) {
  const { reviewID } = req.params
  const { user } = req

  if (!reviewID) {
    return next()
  }
  const review = ReviewModel.findOne({ _id: reviewID }).lean(true)

  if (!review) {
    return next;
  }

  if (user.id !== review.userid.toString()) {
    return res.status(403).send({
      error: "not authorized"
    });
  }

  await ReviewModel.deleteOne({ _id: reviewID })
  res.status(204).end()
})
