const HttpError = require('./HttpError')

class ForbiddenError extends HttpError {
    constructor(message, statusCode = 403) {
        super(message)
        this.statusCode = statusCode
        this.name = 'ForbiddenError'
    }
}

module.exports = ForbiddenError
