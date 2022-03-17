
class UploadHandler {
    constructor(service, validator, albumService) {
        this._service = service
        this._validator = validator
        this._albumService = albumService

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
    }

    async postUploadImageHandler(request, h) {
        const { cover } = request.payload
        this._validator.validateImageHeaders(cover.hapi.headers)

        const { albumId } = request.params

        const fileLocation = await this._service.writeFile(cover, cover.hapi)
        await this._albumService.updateCover(albumId, fileLocation)

        const response = h.response({
            status: 'success',
            message: 'add cover success',
            data: {
                fileLocation
            }
        })
        response.code(201)
        return response
    }
}

module.exports = UploadHandler
