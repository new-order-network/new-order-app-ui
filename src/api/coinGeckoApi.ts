import axios from 'axios'

const coinGeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})

export default coinGeckoApi
