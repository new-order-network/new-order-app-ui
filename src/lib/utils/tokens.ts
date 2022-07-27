import coinGeckoApi from 'api/coinGeckoApi'

import { DEFAULT_NETWORK } from 'constants/network'

export const getTokenPriceByAddress = async (
  tokenAddress: string,
  networkName?: string
): Promise<number> => {
  try {
    const network = networkName ? networkName : DEFAULT_NETWORK.name

    const res = await coinGeckoApi.get(
      `/coins/${network.toLowerCase()}/contract/${tokenAddress.toLowerCase()}`
    )
    return res.data.market_data.current_price.usd
  } catch (err) {
    return 0
  }
}
