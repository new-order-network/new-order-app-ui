import axios from 'axios'

import { env } from 'lib/environment'

const googleApiKey = env.NEXT_PUBLIC_GOOGLE_API_KEY
const playlistId = env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID

const youtubeApi = axios.create({
  baseURL: `https://www.googleapis.com/youtube/v3/playlistItems?&playlistId=${playlistId}&part=snippet&maxResults=50&key=${googleApiKey}`,
  withCredentials: false,
})

export default youtubeApi
