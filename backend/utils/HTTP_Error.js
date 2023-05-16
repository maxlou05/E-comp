class HTTP_Error {
    constructor(status_code, message, details=null) {
        this.status_code = status_code
        this.message = message
        this.details = details
    }
}

module.exports = HTTP_Error