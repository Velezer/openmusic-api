
class ExportHandler {
    constructor(service, validator, playlistsService) {
        this._service = service
        this._validator = validator
        this._playlistsService = playlistsService

        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this)
    }

    async postExportPlaylistHandler(request, h) {
        this._validator.validateExportPlaylistPayload(request.payload)
        const { playlistId } = request.params
        const { id: userId } = request.auth.credentials
        await this._playlistsService.getPlaylistById(playlistId)
        await this._playlistsService.verifyUser(playlistId, userId)

        const message = {
            targetEmail: request.payload.targetEmail,
            playlistId
        }
        await this._service.sendMessage('export:playlist', JSON.stringify(message))

        const response = h.response({
            status: 'success',
            message: 'permintaan Anda sedang diproses'
        })
        response.code(201)
        return response
    }
}

module.exports = ExportHandler
