import { mainnet, goerli, avalanche, avalancheFuji } from 'wagmi/chains'

import { env } from 'lib/environment'

export const SUPPORTED_NETWORKS = [mainnet, goerli, avalanche, avalancheFuji]

export const DEFAULT_NETWORK = mainnet

export const NETWORK_API_URL = {
  1: `https://api.etherscan.io/api?api_key=${env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
  5: `https://api-goerli.etherscan.io/api?api_key=${env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
  43114: `https://api.snowtrace.io/api?apikey=${env.NEXT_PUBLIC_SNOWTRACE_API_KEY}`,
  43113: `https://api-testnet.snowtrace.io/api?apikey=${env.NEXT_PUBLIC_SNOWTRACE_API_KEY}`,
}
