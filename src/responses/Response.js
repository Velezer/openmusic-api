const BadRequestError = require('../exceptions/BadRequestError')
const InternalServerError = require('../exceptions/InternalServerError')
const NotFoundError = require('../exceptions/NotFoundError')

class Response {
    constructor(h) {
        this._h = h
    }

    makeResponse(status, message = null, statusCode, data = null) {
        const resObject = {
            status
        }
        if (data) resObject.data = data
        if (message) resObject.message = message
        const response = this._h.response(resObject)
        response.code(statusCode)
        return response
    }

    success(message = null, statusCode, data = null) {
        return this.makeResponse('success', message, statusCode, data)
    }

    fail(message, statusCode) {
        return this.makeResponse('fail', message, statusCode)
    }

    error(message, statusCode) {
        return this.makeResponse('error', message, statusCode)
    }

    serverError() {
        const serverError = new InternalServerError('server error')
        return this.error(serverError.message, serverError.statusCode)
    }

    errorAll(error) {
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            return this.fail(error.message, error.statusCode)
        }

        return this.serverError()
    }
}

module.exports = Response
