// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const HttpError = require('./exceptions/HttpError')
const Response = require('./responses/response')

const album = require('./api/album')
const AlbumsService = require('./services/AlbumService')
const AlbumValidator = require('./validator/album')

const song = require('./api/song')
const SongService = require('./services/SongService')
const SongValidator = require('./validator/song')

const users = require('./api/users')
const UsersService = require('./services/UsersService')
const UsersValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/AuthenticationsService')
const AuthenticationsValidator = require('./validator/authentications')

const TokenManager = require('./tokenize/TokenManager')

const playlists = require('./api/playlists')
const PlaylistsService = require('./services/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

const exportPlugin = require('./api/export')
const ProducerService = require('./services/ProducerService')
const ExportsValidator = require('./validator/exports')

const uploadCoverAlbum = require('./api/upload-cover-album')
const StorageService = require('./services/StorageService')
const UploadCoverAlbumValidator = require('./validator/uploads')

const CacheService = require('./services/CacheService')

const init = async() => {
    const cacheService = new CacheService()
    const albumService = new AlbumsService(cacheService)
    const songsService = new SongService()
    const usersService = new UsersService()
    const authenticationsService = new AuthenticationsService()

    const playlistsService = new PlaylistsService()
    const storageService = new StorageService('cover')

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register([
        {
            plugin: Jwt
        }
    ])

    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id
            }
        })
    })

    await server.register([{
        plugin: album,
        options: {
            service: albumService,
            validator: AlbumValidator
        }
    },
    {
        plugin: song,
        options: {
            service: songsService,
            validator: SongValidator
        }
    },
    {
        plugin: users,
        options: {
            service: usersService,
            validator: UsersValidator
        }
    },
    {
        plugin: authentications,
        options: {
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator
        }
    },
    {
        plugin: playlists,
        options: {
            playlistsService,
            songsService,
            validator: PlaylistsValidator
        }
    },
    {
        plugin: exportPlugin,
        options: {
            service: ProducerService,
            validator: ExportsValidator,
            playlistsService
        }
    },
    {
        plugin: uploadCoverAlbum,
        options: {
            service: storageService,
            validator: UploadCoverAlbumValidator,
            albumService
        }
    }
    ]
    )

    server.ext('onPreResponse', (request, h) => {
        const { response } = request

        if (response instanceof Error) console.log(response)
        if (response instanceof HttpError) {
            return new Response(h).errorAll(response)
        }

        return response.continue || response
    })

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
