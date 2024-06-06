const router = require('express').Router()
const { validateAgainstSchema, extractValidFields } = require('../lib/validation')

const BusinessesModel = require('../models/business.model')


exports.router = router
/*
 * Schema describing required/optional fields of a business object.
 */
const businessSchema = {
  ownerid: { required: true },
  name: { required: true },
  address: { required: true },
  city: { required: true },
  state: { required: true },
  zip: { required: true },
  phone: { required: true },
  category: { required: true },
  subcategory: { required: true },
  website: { required: false },
  email: { required: false }
}

/*
 * Route to return a list of businesses.
 */
router.get('/', async function (req, res) {

  /*
   * Compute page number based on optional query string parameter `page`.
   * Make sure page is within allowed bounds.
   */
  let page = parseInt(req.query.page) || 1
  const numPerPage = 1
  const documentCount = await BusinessesModel.countDocuments({});
  const lastPage = Math.ceil(documentCount / numPerPage)
  page = page > lastPage ? lastPage : page
  page = page < 1 ? 1 : page


  const pageBusinesses = await BusinessesModel.find(
    {},
    { photos: 0, reviews: 0 },
    { sort: { _id: 1 }, skip: (page - 1) * numPerPage, limit: numPerPage });

  /*
   * Generate HATEOAS links for surrounding pages.
   */
  const links = {}
  if (page < lastPage) {
    links.nextPage = `/businesses?page=${page + 1}`
    links.lastPage = `/businesses?page=${lastPage}`
  }
  if (page > 1) {
    links.prevPage = `/businesses?page=${page - 1}`
    links.firstPage = '/businesses?page=1'
  }

  /*
   * Construct and send response.
   */
  res.status(200).send({
    businesses: pageBusinesses,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: documentCount,
    links: links
  })

})

/*
 * Route to create a new business.
 */
router.post('/', async function (req, res, next) {
  const { user } = req

  if (!validateAgainstSchema(req.body, businessSchema)) {
    return res.status(400).send({
      error: "Request body is not a valid business object"
    })
  }


  let business = extractValidFields(req.body, businessSchema)

  if (user.id !== business.ownerid) {
    return res.status(403).send({
      error: "not authorized"
    });
  }

  business = await BusinessesModel.create(business);
  res.status(201).send({
    id: business.id,
    links: {
      business: `/businesses/${business.id}`
    }
  })
})

/*
 * Route to fetch info about a specific business.
 */
router.get('/:businessid', async function (req, res, next) {
  const { businessid } = req.params
  if (businessid) {
    /*
     * Find all reviews and photos for the specified business and create a
     * new object containing all of the business data, including reviews and
     * photos.
     */
    const business = await BusinessesModel.findOne({ _id: businessid });
    res.status(200).send(business)
  } else {
    next()
  }
})

/*
 * Route to replace data for a business.
 */
router.put('/:businessid', async function (req, res, next) {
  const { businessid } = req.params
  const { user } = req

  if (!businessid) {
    return next()
  }

  if (!validateAgainstSchema(req.body, businessSchema)) {
    return res.status(400).send({
      error: "Request body is not a valid business object"
    })

  }

  const updatedBusiness = extractValidFields(req.body, businessSchema)

  if (user.id !== updatedBusiness.ownerid) {
    return res.status(403).send({
      error: "not authorized"
    });
  }

  await BusinessesModel.updateOne(
    { _id: businessid },
    { updatedBusiness }
  )
  res.status(200).send({
    links: {
      business: `/businesses/${businessid}`
    }
  })

})

/*
 * Route to delete a business.
 */
router.delete('/:businessid', async function (req, res, next) {
  const { businessid } = req.params
  const { user } = req

  if (!businessid) {
    return next()
  }

  const business = await BusinessesModel.findOne({ _id: businessid }).lean(true)

  if (user.id !== business.ownerid) {
    return res.status(403).send({
      error: "not authorized"
    });
  }

  await BusinessesModel.deleteOne({ _id: businessid })
  res.status(204).end()

})
