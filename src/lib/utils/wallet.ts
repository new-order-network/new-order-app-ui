import { MdOutlineAccountBalanceWallet } from 'react-icons/md'

import MetaMaskIcon from 'assets/icons/wallets/Metamask.svg'
import WalletConnectIcon from 'assets/icons/wallets/WalletConnect.svg'
import CoinbaseIcon from 'assets/icons/wallets/Coinbase.svg'

export const getIconForConnector = (connector: string) => {
  switch (connector) {
    case 'metaMask':
      return MetaMaskIcon
    case 'walletConnect':
      return WalletConnectIcon
    case 'coinbaseWallet':
      return CoinbaseIcon
    case 'injected':
      return MdOutlineAccountBalanceWallet
    default:
      return null
  }
}

export const getIconForNetwork = (
  network: number | undefined,
  type: 'source' | 'alt'
  // eslint-disable-next-line consistent-return
) => {
  switch (network) {
    case 1:
      if (type === 'source') {
        return '/images/network/Ethereum.jpeg'
      } else if (type === 'alt') {
        return 'Ethereum'
      }
    case 4:
      if (type === 'source') {
        return '/images/network/Ethereum.jpeg'
      } else if (type === 'alt') {
        return 'Rinkeby'
      }
    case 43113:
    case 43114:
      if (type === 'source') {
        return '/images/network/Avalanche.jpeg'
      } else if (type === 'alt') {
        return 'Avalanche'
      }
    default:
      if (type === 'source') {
        return '/images/network/Ethereum.jpeg'
      } else if (type === 'alt') {
        return ''
      }
  }
}
