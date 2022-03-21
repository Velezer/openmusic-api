const HttpError = require('./HttpError')

class NotFoundError extends HttpError {
    constructor(message, statusCode = 404) {
        super(message)
        this.statusCode = statusCode
        this.name = 'NotFoundError'
    }
}

module.exports = NotFoundError
