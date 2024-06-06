const router = require('express').Router()
const { validateAgainstSchema, extractValidFields } = require('../lib/validation')


exports.router = router

const { generateToken } = require('../lib/jwt')
const { hashPassword, verifyPassword } = require('../lib/password')
const UserModel = require('../models/user.model')


const userSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    isAdmin: { required: false }
}

const loginSchema = {
    email: { required: true },
    password: { required: true },
}

/*
 * Route to create a new user.
 */
router.post('/register', async function (req, res, next) {
    if (!validateAgainstSchema(req.body, userSchema)) {

        return res.status(400).send({
            error: "Request body is not a valid user object"
        })
    }

    let user = extractValidFields(req.body, userSchema)

    /*
     * Make sure the user email is not associated to other account.
     */
    const userExists = await UserModel.findOne({ email: user.email }).lean(true);


    if (userExists) {
        return res.status(400).send({
            error: "User has already exists"
        })
    }

    user.password = hashPassword(user.password)
    user = await UserModel.create(user)

    res.status(201).send({ id: user.id })

})


/*
 * Route to create a new user.
 */
router.post('/login', async function (req, res, next) {
    if (!validateAgainstSchema(req.body, loginSchema)) {

        return res.status(400).send({
            error: "Request body is not a valid user object"
        })
    }

    const credentials = extractValidFields(req.body, userSchema)

    /*
     * Make sure the user email is not associated to other account.
     */
    const user = await UserModel.findOne({ email: credentials.email }).lean(true);


    if (!user) {
        return res.status(401).send({ error: "invalid credentials" })
    }

    const isPasswordCorrect = verifyPassword(credentials.password, user.password)

    if (!isPasswordCorrect) {
        return res.status(401).send({ error: "invalid credentials" })
    }

    const token = generateToken(user)
    res.status(201).send({ token })

})


/*
 * Route for admin users to create a new admin user.
 */
router.post('/create-admin', async function (req, res, next) {
    if (!validateAgainstSchema(req.body, userSchema)) {

        return res.status(400).send({
            error: "Request body is not a valid user object"
        })
    }

    const user = extractValidFields(req.body, userSchema)

    /*
     * Make sure the user email is not associated to other account.
     */
    const userExists = await UserModel.findOne({ email: user.email }).lean(true);


    if (userExists) {
        return res.status(400).send({
            error: "User has already exists"
        })
    }

    user.password = hashPassword(user.password)
    user = await UserModel.create({ ...user, isAdmin: true })
    res.status(201).send({ id: user.id })
})