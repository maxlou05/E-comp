// Error handling middleware (all errors should be a HttpError object)
function HTTPErrorHandler(err, req, res, next) {
    // If there are extra details, return those too
    if (err.details) {
        console.log(JSON.stringify(err.details, null, 2))
        return res
            .status(err.status_code)
            .json({"error": err.message, "details": err.details})
    }
    // Otherwise, return regular error message
    if (err.status_code) {
        return res
            .status(err.status_code)
            .json({"error": err.message})
    }
}

module.exports.HTTPErrorHandler = HTTPErrorHandler