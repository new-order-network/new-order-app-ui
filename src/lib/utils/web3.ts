import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { configureChains, Connector } from 'wagmi'
import { providers } from 'ethers'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { env } from 'lib/environment'

import { SUPPORTED_NETWORKS } from 'constants/network'

type ProviderConfig = { chainId?: number; connector?: Connector }

export const isChainSupported = (chainId?: number) => {
  return SUPPORTED_NETWORKS.some((x) => {
    return x.id === chainId
  })
}

export const { chains, provider } = configureChains(SUPPORTED_NETWORKS, [
  alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_ID }),
  infuraProvider({ apiKey: env.NEXT_PUBLIC_INFURA_ID }),
  jsonRpcProvider({
    rpc: (chain) => {
      return { http: chain.rpcUrls.default }
    },
  }),
])

export const connectors = () => {
  return [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        infuraId: env.NEXT_PUBLIC_INFURA_ID,
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'new-order',
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
        name: (detectedName) => {
          return `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`
        },
      },
    }),
  ]
}

export const webSocketProvider = ({ chainId }: ProviderConfig) => {
  return isChainSupported(chainId)
    ? new providers.InfuraWebSocketProvider(chainId, env.NEXT_PUBLIC_INFURA_ID)
    : undefined
}
