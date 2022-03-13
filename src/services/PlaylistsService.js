const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const BadRequestError = require('../exceptions/BadRequestError')
const { dtoAllPlaylistsFromDB, dtoSongsPlaylistsFromDB } = require('../dto/playlist.dto')
const ForbiddenError = require('../exceptions/ForbiddenError')
const SongService = require('./SongService')

class PlaylistsService {
    constructor() {
        this._pool = new Pool()
        this.songService = new SongService()

        this.addSongPlaylist = this.addSongPlaylist.bind(this)
        this.getSongsPlaylist = this.getSongsPlaylist.bind(this)
    }

    async addPlaylist(name, userId) {
        const id = `playlist-${nanoid(16)}`

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new BadRequestError('playlist gagal ditambahkan')
        }
        return result.rows[0].id
    }

    async addSongPlaylist(playlistId, songId) {
        await this.songService.getSongById(songId)

        const id = `playsong-${nanoid(16)}`

        const query = {
            text: 'INSERT INTO playsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId]
        }

        const result = await this._pool.query(query).catch(err => console.log(err))

        if (!result.rows.length) {
            throw new BadRequestError('song playlist gagal ditambahkan')
        }
        return result.rows[0].id
    }

    async getSongsPlaylist(playlistId) {
        const playlist = await this.getPlaylistById(playlistId)
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
        playlist.songs = result.rows.map(dtoSongsPlaylistsFromDB)
        return playlist
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
            throw new BadRequestError('playlist gagal diambil')
        }
        return result.rows.map(dtoAllPlaylistsFromDB)[0]
    }

    async getPlaylists(userId) {
        const query = {
            text: `SELECT playlists.*, users.username
                    FROM playlists
                    JOIN users ON users.id = playlists.user_id
                    WHERE playlists.user_id = $1`,
            values: [userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new BadRequestError('playlist gagal diambil')
        }
        return result.rows.map(dtoAllPlaylistsFromDB)
    }

    async deletePlaylist(id, userId) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 AND user_id = $2 RETURNING id',
            values: [id, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new BadRequestError('playlist gagal dihapus')
        }
    }

    async verifyUser(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1 AND user_id = $2',
            values: [playlistId, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new ForbiddenError('playlist gagal diverifikasi')
        }
    }
}

module.exports = PlaylistsService
