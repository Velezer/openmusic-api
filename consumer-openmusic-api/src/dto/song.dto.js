/* eslint-disable camelcase */
const dtoSongFromDB = ({
    id,
    title, year, genre, performer, duration, album_id,
    created_at,
    updated_at
}) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId: album_id,
    createdAt: created_at,
    updatedAt: updated_at
})
const dtoAllSongFromDB = ({
    id,
    title, performer
}) => ({
    id,
    title,
    performer
})

module.exports = { dtoSongFromDB, dtoAllSongFromDB }
