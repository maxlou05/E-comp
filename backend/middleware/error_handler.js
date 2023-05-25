// Error handling middleware (all errors should be a HTTP_Error object)
function HTTPErrorHandler(err, req, res, next) {
    // If there are extra details, return those too
    if (err.details) return res
        .status(err.status_code)
        .json({"error": err.message, "details": err.details})
    // Otherwise, return regular error message
    if (err.status_code) {
        return res
            .status(err.status_code)
            .json({"error": err.message})
    }
    throw err
}

module.exports.HTTPErrorHandler = HTTPErrorHandler