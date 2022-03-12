const BadRequestError = require('../../exceptions/BadRequestError')
const { UserPayloadSchema } = require('./schema')

const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new BadRequestError(validationResult.error.message)
        }
    }
}

module.exports = UsersValidator
