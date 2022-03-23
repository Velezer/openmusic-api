require('dotenv').config()
class Listener {
    constructor(playlistService, mailSender) {
        this._playlistService = playlistService
        this._mailSender = mailSender

        this.listen = this.listen.bind(this)
    }

    async listen(message) {
        try {
            const {
                targetEmail,
                playlistId
            } = JSON.parse(message.content.toString())

            const data = await this._playlistService.getSongsPlaylistConsumer(playlistId)
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(data))
            console.log(result)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Listener
