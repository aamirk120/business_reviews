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
  if (validateAgainstSchema(req.body, businessSchema)) {
    let business = extractValidFields(req.body, businessSchema)
    business = await BusinessesModel.create(business);
    res.status(201).send({
      id: business.id,
      links: {
        business: `/businesses/${business.id}`
      }
    })
  } else {
    res.status(400).send({
      error: "Request body is not a valid business object"
    })
  }
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
  if (businessid) {

    if (validateAgainstSchema(req.body, businessSchema)) {
      await BusinessesModel.updateOne(
        { _id: businessid },
        { ...extractValidFields(req.body, businessSchema) }
      )
      res.status(200).send({
        links: {
          business: `/businesses/${businessid}`
        }
      })
    } else {
      res.status(400).send({
        error: "Request body is not a valid business object"
      })
    }

  } else {
    next()
  }
})

/*
 * Route to delete a business.
 */
router.delete('/:businessid', async function (req, res, next) {
  const { businessid } = req.params
  if (businessid) {
    await BusinessesModel.deleteOne({ _id: businessid })
    res.status(204).end()
  } else {
    next()
  }
})
