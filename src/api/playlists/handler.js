
class PlaylistsHandler {
    constructor(PlaylistsService, notesService, validator) {
        this._playlistsService = PlaylistsService
        this._notesService = notesService
        this._validator = validator

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this)
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload)
        const { id: userId } = request.auth.credentials
        const { name } = request.payload

        const playlistId = await this._playlistsService.addPlaylist(name, userId)

        const response = h.response({
            status: 'success',
            message: 'playlist berhasil ditambahkan',
            data: {
                playlistId
            }
        })
        response.code(201)
        return response
    }

    async getPlaylistHandler(request, h) {
        const { id: userId } = request.auth.credentials

        const playlists = await this._playlistsService.getPlaylists(userId)

        return {
            status: 'success',
            data: {
                playlists
            }
        }
    }

    async deletePlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload)
        const { id: credentialId } = request.auth.credentials
        const { noteId, userId } = request.payload

        await this._notesService.verifyNoteOwner(noteId, credentialId)
        await this._playlistsService.deletePlaylist(noteId, userId)

        return {
            status: 'success',
            message: 'playlist berhasil dihapus'
        }
    }
}

module.exports = PlaylistsHandler
