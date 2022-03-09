const HttpError = require('./HttpError')

class BadRequestError extends HttpError {
    constructor(message, statusCode = 400) {
        super(message)
        this.statusCode = statusCode
        this.name = 'BadRequestError'
    }
}

module.exports = BadRequestError
