const HttpError = require('./HttpError')

class InternalServerError extends HttpError {
    constructor(message, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
        this.name = 'InternalServerError'
    }
}

module.exports = InternalServerError
