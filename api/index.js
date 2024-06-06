const { Router } = require('express')

const businessesRouter = require('./businesses').router
const reviewsRouter = require('./reviews').router
const photosRouter = require('./photos').router
const usersRouter = require('./users').router
const authRouter = require('./auth').router

const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/businesses', businessesRouter)
router.use('/reviews', reviewsRouter)
router.use('/photos', photosRouter)

module.exports = router
