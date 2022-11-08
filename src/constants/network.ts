import { Chain, chain } from 'wagmi'

import { env } from 'lib/environment'

export const ethereumMainnet: Chain = {
  ...chain.mainnet,
  testnet: false,
}

export const ethereumGoerli: Chain = {
  ...chain.goerli,
  testnet: true,
}

export const avalancheMainnet: Chain = {
  id: 43114,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://api.avax.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
    default: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
  },
  testnet: false,
}

export const avalancheTestnet: Chain = {
  id: 43113,
  name: 'Avalanche Fuji Testnet',
  network: 'avalancheTestnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    etherscan: {
      name: 'SnowTrace Testnet',
      url: 'https://testnet.snowtrace.io/',
    },
    default: {
      name: 'SnowTrace Testnet',
      url: 'https://testnet.snowtrace.io/',
    },
  },
  testnet: true,
}

export const SUPPORTED_NETWORKS = [
  ethereumMainnet,
  ethereumGoerli,
  avalancheMainnet,
  avalancheTestnet,
]

export const DEFAULT_NETWORK = chain.mainnet

export const NETWORK_API_URL = {
  1: `https://api.etherscan.io/api?api_key=${env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
  5: `https://api-goerli.etherscan.io/api?api_key=${env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
  43114: `https://api.snowtrace.io/api?apikey=${env.NEXT_PUBLIC_SNOWTRACE_API_KEY}`,
  43113: `https://api-testnet.snowtrace.io/api?apikey=${env.NEXT_PUBLIC_SNOWTRACE_API_KEY}`,
}
