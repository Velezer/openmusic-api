const HttpError = require('./HttpError')

class UnauthorizedError extends HttpError {
    constructor(message, statusCode = 401) {
        super(message)
        this.statusCode = statusCode
        this.name = 'UnauthorizedError'
    }
}

module.exports = UnauthorizedError
