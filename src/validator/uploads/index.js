const BadRequestError = require('../../exceptions/BadRequestError')
const { ImageHeadersSchema } = require('./schema')

const UploadCoverAlbumValidator = {
    validateImageHeaders: (headers) => {
        const validationResult = ImageHeadersSchema.validate(headers)

        if (validationResult.error) {
            throw new BadRequestError(validationResult.error.message)
        }
    }
}

module.exports = UploadCoverAlbumValidator
