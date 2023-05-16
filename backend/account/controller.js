const hash = require('object-hash')
const config = require('dotenv').config
const jwt_utils = require('../utils/jwt')
const db_utils = require('../database/utils')
const HTTP_Error = require('../utils/HTTP_Error')

const User = require('../database/models/user')
const Event = require('../database/models/event')
const Participant = require('../database/models/participant')
const Submission = require('../database/models/submission')

// import settings
config({ path: '../.env'})

/**************** Handlers ****************/
async function create_account(req, res, next) {
    // Hash the password
    const hashed_password = hash(req.body.password, {algorithm: process.env.HASH_ALG})
    // Build and save a new user (uploads it database)
    User.create({Username: req.body.username, HashedPassword: hashed_password})
        .then((myuser) => {
            // console.log(myuser.get())
            return res
                .status(201)
                .json({"message": "successfully added user"})
        })
        .catch((err) => {
            // Check for username already exists error
            if(err.code == 'ER_DUP_ENTRY' || err.original.code == 'ER_DUP_ENTRY') next(new HTTP_Error(406, "username already exists"))
            else {
                console.log('uh oh! Unexpected error occured when creating an account: ')
                console.log(err)
                next(new HTTP_Error(500, "server error :( Unexpected error occured when creating an account", err))
            }
        })
}

async function token(req, res) {
    // Generate and sign a token (needs to have 'sub' property for subject)
    const jwt = await jwt_utils.create({sub: res.locals.username})
    return res
        .status(200)
        .json({"message": "login success!", "access_token": `Bearer ${jwt}`})
}

async function change_password(req, res) {
    const new_password = hash(req.body.new_password, {algorithm: process.env.HASH_ALG})

    // Update the 'user' table
    await User.update({HashedPassword: new_password}, {
        where: {
            Username: res.locals.username
        }
    })

    return res
        .status(201)
        .json({"message": "succesfully changed your password"})
}

async function delete_account(req, res) {
    // Delete from 'participants' table
    await Participant.destroy({
        where: {
            User: res.locals.username
        }
    })
    // Delete from 'submissions' table
    await Submission.destroy({
        where: {
            User: res.locals.username
        }
    })
    // Delete owned events ('activities', 'activitysets', and 'events' tables)
    const eventIDs = await Event.findAll({
        attributes: ['EventID'],
        where: {
            Host: res.locals.username
        }
    })
    eventIDs.forEach(async (value, index, array) => {
        await db_utils.delete_event(value.EventID)
    })
    // Delete from 'users' table
    await User.destroy({
        where: {
            Username: res.locals.username
        }
    })

    return res
        .status(200)
        .json({"message": "succesfully deleted your account"})
}

function get_username(req, res) {
    return res
        .status(200)
        .json({"message": `welcome, ${res.locals.username}!`})
}

// Export all the functions
module.exports.create_account = create_account
module.exports.change_password = change_password
module.exports.delete_account = delete_account
module.exports.token = token
module.exports.get_username = get_username