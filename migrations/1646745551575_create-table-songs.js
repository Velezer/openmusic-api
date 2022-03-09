/* eslint-disable camelcase */

// exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type: 'VARCHAR(255)',
            notNull: true
        },
        year: {
            type: 'integer',
            notNull: true
        },
        genre: {
            type: 'VARCHAR(255)',
            notNull: true
        },
        performer: {
            type: 'VARCHAR(255)',
            notNull: true
        },
        duration: {
            type: 'integer'
        },
        album_id: {
            type: 'VARCHAR(50)',
            references: '"albums"'
        },
        created_at: {
            type: 'timestamp',
            notNull: true
        },
        updated_at: {
            type: 'timestamp',
            notNull: true
        }
    })
}

exports.down = pgm => {
    pgm.dropTable('songs')
}
