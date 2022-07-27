import axios from 'axios'

const mediumUsername = 'neworderdao'

const mediumApi = axios.create({
  baseURL: `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${mediumUsername}`,
  withCredentials: false,
})

export default mediumApi
