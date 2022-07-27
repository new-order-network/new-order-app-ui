import { render } from '@testing-library/react'
import { WagmiConfig } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import { defaultChains, MockConnector, wallets } from 'wagmi-testing'

import WalletWidget from 'components/WalletWidget/WalletWidget'

import theme from 'theme'

describe('WalletWidget.tsx component', () => {
  const connector: MockConnector = new MockConnector({
    chains: defaultChains,
    options: {
      network: 1,
      privateKey: wallets.ethers1.privateKey,
    },
  })

  test('match to snapshot', () => {
    const { container } = render(
      <ChakraProvider theme={theme}>
        {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <WagmiConfig connectors={[connector]}>
          <WalletWidget />
        </WagmiConfig>
      </ChakraProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('match to snapshot with connected account', () => {
    const { container } = render(
      <ChakraProvider theme={theme}>
        {/*  eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <WagmiConfig connectors={[connector]} autoConnect>
          <WalletWidget />
        </WagmiConfig>
      </ChakraProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
