const config = require('dotenv').config
const jwt_utils = require('../utils/jwt')
const HttpError = require('../utils/HttpError')
const User = require('../database/models/user')



// import settings
config({ path: '../.env'})

/**************** Handlers ****************/
async function get_user(req, res, next) {
    return res
        .status(200)
        .json({"user": res.locals.username})
}

async function create_account(req, res, next) {
    try {
        // Build and save a new user (uploads it database)
        const user = await User.create({username: req.body.username, password: req.body.password})

        return res
            .status(201)
            .json({"message": `successfully created your account, ${user.username}. Please login to continue`})
    } catch (err) {
        if(err.name == 'SequelizeUniqueConstraintError') next(new HttpError(406, "username already exists"))
        else {
            next(new HttpError(500, "unexpected error", err))
        }
    }
}

async function token(req, res) {
    // Generate and sign a token (needs to have 'sub' property for subject)
    const jwt = await jwt_utils.create({sub: res.locals.username})

    return res
        .status(200)
        .set('set-cookie', `accessToken=Bearer ${jwt}; Path=/; SameSite=Lax; Max-Age=3600; HttpOnly`)
        .json({"message": "login success!"})
}

async function logout(req, res) {
    return res
        .status(200)
        .set('set-cookie', `accessToken=logged out; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 UTC; HttpOnly`)
        .json({"message": "successfully logged out"})
}

async function change_password(req, res) {
    try {
        // Update the 'Users' table
        await User.update({password: req.body.new_password}, {
            where: {
                username: res.locals.username
            }
        })

        return res
            .status(201)
            .json({"message": "succesfully changed your password"})
    } catch (err) {
        next(new HttpError(500, "unexpected error", err))
    }
}

async function delete_account(req, res) {
    // Deleting the user should cascade based upon established associations
    // No error checking since it's not possible for deleting to have error occur
    await User.destroy({
        where: {
            username: res.locals.username
        }
    })

    return res
        .status(200)
        .json({"message": "succesfully deleted your account"})
}

// Export all the functions
module.exports.get_user = get_user
module.exports.create_account = create_account
module.exports.change_password = change_password
module.exports.delete_account = delete_account
module.exports.token = token
module.exports.logout = logout