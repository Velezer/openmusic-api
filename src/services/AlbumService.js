const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../exceptions/NotFoundError')
const { dtoAlbumFromDB } = require('../dto/album.dto')
const InternalServerError = require('../exceptions/InternalServerError')

class AlbumService {
    constructor() {
        this._pool = new Pool()
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, name, year, null, createdAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InternalServerError('add album failed')
        }

        return result.rows[0].id
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums')
        return result.rows.map(dtoAlbumFromDB)
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }
        const result = await this._pool.query(query).catch(err => console.log(err))

        if (!result.rows.length) {
            throw new NotFoundError('id not found')
        }

        return result.rows.map(dtoAlbumFromDB)[0]
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('id not found')
        }
    }

    async updateCover(id, coverUrl) {
        const updatedAt = new Date().toISOString()
        const query = {
            text: 'UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id',
            values: [coverUrl, updatedAt, id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('id not found')
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('id not found')
        }
    }
}

module.exports = AlbumService
