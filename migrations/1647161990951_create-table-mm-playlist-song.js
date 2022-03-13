/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
    // membuat table playsongs
    pgm.createTable('playsongs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    })

    pgm.addConstraint('playsongs', 'fk_playsongs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
    pgm.addConstraint('playsongs', 'fk_playsongs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
    pgm.dropTable('playsongs')
}
