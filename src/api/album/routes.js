const path = '/albums'
const routes = (handler) => [
    {
        method: 'POST',
        path: path,
        handler: handler.postAlbumHandler
    },
    {
        method: 'POST',
        path: '/albums/{albumId}/likes',
        handler: handler.postLikeOrDislikeAlbumHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/albums/{albumId}/likes',
        handler: handler.getAlbumLikesHandler
    },
    {
        method: 'GET',
        path: path,
        handler: handler.getAlbumsHandler
    },
    {
        method: 'GET',
        path: path + '/{id}',
        handler: handler.getAlbumByIdHandler
    },
    {
        method: 'PUT',
        path: path + '/{id}',
        handler: handler.putAlbumByIdHandler
    },
    {
        method: 'DELETE',
        path: path + '/{id}',
        handler: handler.deleteAlbumByIdHandler
    }
]

module.exports = routes
