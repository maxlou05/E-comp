const jwt_utils = require('./jwt')
const hash = require('object-hash')
const User = require('../database/models/user')
const HTTP_Error = require('./HTTP_Error')

// Get username from token
async function authenticate(req, res, next) {
    // Verify the token
    const payload = await jwt_utils.verify(req.headers.authorization.split(' ')[1])
    // If token is invalid, pass on the error to error handler
    if (payload.err) {
        next(payload.err)
        return
    }
    // If token is valid, save it to locals to pass it on to next middleware or handlers
    res.locals.username = payload.data.sub
    next()
}

// Check the password
async function checkPassword(req, res, next) {
    const hashed_password = hash(req.body.password, {algorithm: process.env.HASH_ALG})

    // See if the we already authenticated the user
    let username = res.locals.username
    // If not authenticated, then should provide a username
    if (!username) username = req.body.username 
    // If still no username, raise error
    if (!username) {
        next(new HTTP_Error(406, "did not provide a username"))
        return
    }

    // Query for the user
    const users = await User.findAll({
        where: {
            Username: username
        }
    })
    // Check if the requested user does not exist
    if (users.length == 0) next(new HTTP_Error(401, "this username doesn't exist"))
    // Check if the password was correct
    else if (users[0].HashedPassword != hashed_password) next(new HTTP_Error(401, "incorrect password"))
    // If password is correct, then continue without errors
    else {
        // In case the username wasn't given from the token, save it now
        res.locals.username = username
        next()
    }
}

// Error handling middleware (all errors should be a HTTP_Error object)
function HTTPErrorHandler(err, req, res, next) {
    // If there are extra details, return those too
    if (err.details) return res
        .status(err.status_code)
        .json({"error": err.message, "details": err.details})
    // Otherwise, return regular error message
    return res
        .status(err.status_code)
        .json({"error": err.message})
}

module.exports.authenticate = authenticate
module.exports.checkPassword = checkPassword
module.exports.HTTPErrorHandler = HTTPErrorHandler