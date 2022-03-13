/* eslint-disable camelcase */

const dtoAllPlaylistsFromDB = ({
    id,
    name,
    username
}) => ({
    id,
    name,
    username
})
const dtoSongsPlaylistsFromDB = ({
    song_id,
    title,
    performer
}) => ({
    id: song_id,
    title,
    performer
})

module.exports = { dtoAllPlaylistsFromDB, dtoSongsPlaylistsFromDB }
