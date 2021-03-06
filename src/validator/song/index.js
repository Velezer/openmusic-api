const BadRequestError = require('../../exceptions/BadRequestError')
const { SongPayloadSchema } = require('./schema')

const SongValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new BadRequestError(validationResult.error.message)
        }
    }
}

module.exports = SongValidator
