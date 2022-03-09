const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../exceptions/NotFoundError')
const { dtoSongFromDB, dtoAllSongFromDB } = require('../dto/song.dto')
const InternalServerError = require('../exceptions/InternalServerError')

class SongService {
    constructor() {
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InternalServerError('add song failed')
        }

        return result.rows[0].id
    }

    async getSongs() {
        const result = await this._pool.query('SELECT * FROM songs')
        return result.rows.map(dtoAllSongFromDB)
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('id not found')
        }

        return result.rows.map(dtoSongFromDB)[0]
    }

    async editSongById(id, { title, year, genre, performer, duration, albumId }) {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, updatedAt, id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('id not found')
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('id not found')
        }
    }
}

module.exports = SongService