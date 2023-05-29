class HttpError extends Error {
    constructor(status_code, message, details=null) {
        super(message)
        this.name = "HttpError"
        this.status_code = status_code
        this.details = details
    }
}

module.exports = HttpError