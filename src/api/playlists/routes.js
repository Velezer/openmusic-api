const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    // playsongs
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: handler.postSongPlaylistHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: handler.getSongsPlaylistHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: handler.deleteSongPlaylistHandler,
        options: {
            auth: 'openmusic_jwt'
        }
    }
]

module.exports = routes
