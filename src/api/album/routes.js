const path = '/albums'
const routes = (handler) => [
    {
        method: 'POST',
        path: path,
        handler: handler.postAlbumHandler
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
