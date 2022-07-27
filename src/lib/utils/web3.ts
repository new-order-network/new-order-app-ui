import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { configureChains, Connector } from 'wagmi'
import { providers } from 'ethers'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { env } from 'lib/environment'

import { DEFAULT_NETWORK, SUPPORTED_NETWORKS } from 'constants/network'

type ProviderConfig = { chainId?: number; connector?: Connector }

export const isChainSupported = (chainId?: number) => {
  return SUPPORTED_NETWORKS.some((x) => {
    return x.id === chainId
  })
}

export const connectors = ({ chainId }: { chainId?: number }) => {
  const rpcUrl =
    SUPPORTED_NETWORKS.find((x) => {
      return x.id === chainId
    })?.rpcUrls?.default ?? DEFAULT_NETWORK.rpcUrls.default

  return [
    new MetaMaskConnector({
      chains: SUPPORTED_NETWORKS,
      options: {
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains: SUPPORTED_NETWORKS,
      options: {
        infuraId: env.NEXT_PUBLIC_INFURA_ID,
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains: SUPPORTED_NETWORKS,
      options: {
        appName: 'new-order',
        jsonRpcUrl: `${rpcUrl}/${env.NEXT_PUBLIC_INFURA_ID}`,
      },
    }),
    new InjectedConnector({
      chains: SUPPORTED_NETWORKS,
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

export const { provider } = configureChains(SUPPORTED_NETWORKS, [
  alchemyProvider({ alchemyId: env.NEXT_PUBLIC_ALCHEMY_ID }),
  jsonRpcProvider({
    rpc: (chain) => {
      return { http: chain.rpcUrls.default }
    },
  }),
])

export const webSocketProvider = ({ chainId }: ProviderConfig) => {
  return isChainSupported(chainId)
    ? new providers.InfuraWebSocketProvider(chainId, env.NEXT_PUBLIC_INFURA_ID)
    : undefined
}
