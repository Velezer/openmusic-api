const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const BadRequestError = require('../exceptions/BadRequestError')
const { dtoAllPlaylistsFromDB } = require('../dto/playlist.dto')

class PlaylistsService {
    constructor() {
        this._pool = new Pool()
    }

    async addPlaylist(name, userId) {
        const id = `collab-${nanoid(16)}`

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

    async getPlaylists(userId) {
        const query = {
            // text: 'SELECT * FROM playlists WHERE user_id = $1',
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

    async deletePlaylist(noteId, userId) {
        const query = {
            text: 'DELETE FROM playlists WHERE note_id = $1 AND user_id = $2 RETURNING id',
            values: [noteId, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new BadRequestError('playlist gagal dihapus')
        }
    }

    async verifyCollaborator(noteId, userId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE note_id = $1 AND user_id = $2',
            values: [noteId, userId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new BadRequestError('playlist gagal diverifikasi')
        }
    }
}

module.exports = PlaylistsService
