
class PlaylistsHandler {
    constructor(PlaylistsService, notesService, validator) {
        this._playlistsService = PlaylistsService
        this._validator = validator

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
        this.postSongPlaylistHandler = this.postSongPlaylistHandler.bind(this)
        this.getSongsPlaylistHandler = this.getSongsPlaylistHandler.bind(this)
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this)
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
        this.deleteSongPlaylistHandler = this.deleteSongPlaylistHandler.bind(this)
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

    async postSongPlaylistHandler(request, h) {
        this._validator.validateSongPlaylistPayload(request.payload)
        const { id: userId } = request.auth.credentials
        const { playlistId } = request.params
        const { songId } = request.payload

        await this._playlistsService.verifyUser(playlistId, userId)
        const playsongId = await this._playlistsService.addSongPlaylist(playlistId, songId)

        const response = h.response({
            status: 'success',
            message: 'song playlist berhasil ditambahkan',
            data: {
                playsongId
            }
        })
        response.code(201)
        return response
    }

    async deleteSongPlaylistHandler(request, h) {
        this._validator.validateSongPlaylistPayload(request.payload)
        const { id: userId } = request.auth.credentials
        const { playlistId } = request.params
        const { songId } = request.payload

        await this._playlistsService.verifyUser(playlistId, userId)
        await this._playlistsService.deleteSongPlaylist(playlistId, songId)

        const response = h.response({
            status: 'success',
            message: 'song playlist berhasil dihapus'
        })
        return response
    }

    async getSongsPlaylistHandler(request, h) {
        const { id: userId } = request.auth.credentials
        const { playlistId } = request.params

        const playlist = await this._playlistsService.getPlaylistById(playlistId)
        await this._playlistsService.verifyUser(playlistId, userId)
        const songs = await this._playlistsService.getSongsPlaylist(playlistId)
        playlist.songs = songs

        const response = h.response({
            status: 'success',
            data: {
                playlist
            }
        })
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
        const { id: userId } = request.auth.credentials
        const { id } = request.params

        await this._playlistsService.verifyUser(id, userId)
        await this._playlistsService.deletePlaylist(id, userId)

        return {
            status: 'success',
            message: 'playlist berhasil dihapus'
        }
    }
}

module.exports = PlaylistsHandler
