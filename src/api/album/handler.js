const Response = require('../../responses/response')

class AlbumHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator

        this.postAlbumHandler = this.postAlbumHandler.bind(this)
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this)
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this)
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this)
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload)
        const { name, year } = request.payload

        const albumId = await this._service.addAlbum({ name, year })
        const data = { albumId }
        return new Response(h).success('album added', 201, data)
    }

    async getAlbumsHandler(request, h) {
        const albums = await this._service.getAlbums()
        const data = {
            albums
        }
        return new Response(h).success(null, 200, data)
    }

    async getAlbumByIdHandler(request, h) {
        const { id } = request.params
        const album = await this._service.getAlbumById(id)
        const data = {
            album
        }
        return new Response(h).success(null, 200, data)
    }

    async putAlbumByIdHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload)
        const { id } = request.params

        await this._service.editAlbumById(id, request.payload)

        return new Response(h).success('edit album success', 200, null)
    }

    async deleteAlbumByIdHandler(request, h) {
        const { id } = request.params
        await this._service.deleteAlbumById(id)

        return new Response(h).success('deleted success', 200)
    }
}

module.exports = AlbumHandler
