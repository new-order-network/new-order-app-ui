import axios from 'axios'

// TODO: change API key and playlist ID with the New Order DAO channel ID
const googleApiKey = ''
const playlistId = ''

const youtubeApi = axios.create({
  baseURL: `https://www.googleapis.com/youtube/v3/playlistItems?&playlistId=${playlistId}&part=snippet&maxResults=50&key=${googleApiKey}`,
  withCredentials: false,
})

export default youtubeApi
