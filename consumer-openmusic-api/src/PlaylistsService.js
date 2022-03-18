const { Pool } = require('pg')
const BadRequestError = require('../exceptions/BadRequestError')
const { dtoAllPlaylistsFromDB, dtoSongsPlaylistsFromDB } = require('../dto/playlist.dto')
const SongService = require('./SongService')
const NotFoundError = require('../exceptions/NotFoundError')

class PlaylistsService {
    constructor() {
        this._pool = new Pool()
        this.songService = new SongService()

        this.getSongsPlaylist = this.getSongsPlaylist.bind(this)
        this.getSongsPlaylistConsumer = this.getSongsPlaylistConsumer.bind(this)
    }

    async getSongsPlaylistConsumer(playlistId) {
        const playlist = await this.getPlaylistById(playlistId)
        const songs = await this.getSongsPlaylist(playlistId)
        playlist.songs = songs
        delete playlist.username

        return { playlist }
    }

    async getSongsPlaylist(playlistId) {
        const query = {
            text: `SELECT *
                    FROM playsongs 
                    JOIN songs ON songs.id = playsongs.song_id
                    JOIN playlists ON playlists.id = playsongs.playlist_id
                    WHERE playsongs.playlist_id = $1`,
            values: [playlistId]
        }

        const result = await this._pool.query(query).catch(err => console.log(err))

        if (!result.rows.length) {
            throw new BadRequestError('song playlist kosong')
        }
        const songs = result.rows.map(dtoSongsPlaylistsFromDB)
        return songs
    }

    async getPlaylistById(playlistId) {
        const query = {
            text: `SELECT playlists.*, users.username
                    FROM playlists
                    JOIN users ON users.id = playlists.user_id
                    WHERE playlists.id = $1`,
            values: [playlistId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('playlist tidak ada')
        }
        return result.rows.map(dtoAllPlaylistsFromDB)[0]
    }
}

module.exports = PlaylistsService
