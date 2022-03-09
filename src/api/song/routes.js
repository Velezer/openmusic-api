const path = '/songs'
const routes = (handler) => [
    {
        method: 'POST',
        path: path,
        handler: handler.postSongHandler
    },
    {
        method: 'GET',
        path: path,
        handler: handler.getSongsHandler
    },
    {
        method: 'GET',
        path: path + '/{id}',
        handler: handler.getSongByIdHandler
    },
    {
        method: 'PUT',
        path: path + '/{id}',
        handler: handler.putSongByIdHandler
    },
    {
        method: 'DELETE',
        path: path + '/{id}',
        handler: handler.deleteSongByIdHandler
    }
]

module.exports = routes
