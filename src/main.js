// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const album = require('./api/album')
const song = require('./api/song')
const HttpError = require('./exceptions/HttpError')
const Response = require('./responses/response')
const AlbumsService = require('./services/AlbumService')
const SongService = require('./services/SongService')
const AlbumValidator = require('./validator/album')
const SongValidator = require('./validator/song')

const init = async() => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register([{
        plugin: album,
        options: {
            service: new AlbumsService(),
            validator: AlbumValidator
        }
    },
    {
        plugin: song,
        options: {
            service: new SongService(),
            validator: SongValidator
        }
    }
    ]
    )

    server.ext('onPreResponse', (request, h) => {
        const { response } = request

        if (response instanceof HttpError) {
            return new Response(h).errorAll(response)
        }

        return response.continue || response
    })

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
