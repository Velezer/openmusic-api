const Response = require('../../responses/response')

class SongHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator

        this.postSongHandler = this.postSongHandler.bind(this)
        this.getSongsHandler = this.getSongsHandler.bind(this)
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }

    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload)
        const { title, year, genre, performer, duration, albumId } = request.payload
        const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
        const data = { songId }
        return new Response(h).success('Song added', 201, data)
    }

    async getSongsHandler(request, h) {
        const songs = await this._service.getSongs()
        const data = {
            songs
        }
        return new Response(h).success(null, 200, data)
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params
        const song = await this._service.getSongById(id)
        const data = {
            song
        }
        return new Response(h).success(null, 200, data)
    }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongPayload(request.payload)
        const { id } = request.params

        await this._service.editSongById(id, request.payload)

        return new Response(h).success('edit song success', 200, null)
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params
        await this._service.deleteSongById(id)

        return new Response(h).success('deleted success', 200)
    }
}

module.exports = SongHandler
