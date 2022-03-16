const BadRequestError = require('../../exceptions/BadRequestError')
const ExportPlaylistPayloadSchema = require('./schema')

const ExportsValidator = {
    validateExportPlaylistPayload: (payload) => {
        const validationResult = ExportPlaylistPayloadSchema.validate(payload)

        if (validationResult.error) {
            throw new BadRequestError(validationResult.error.message)
        }
    }
}

module.exports = ExportsValidator
