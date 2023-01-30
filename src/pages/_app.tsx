import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { createClient, createStorage, WagmiConfig } from 'wagmi'
import { ApolloProvider } from '@apollo/client'
import NextNProgress from 'nextjs-progressbar'
import { ErrorBoundary } from 'react-error-boundary'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-quill/dist/quill.snow.css'

import { ErrorFallback } from 'components/ErrorFallback'
import Fonts from 'components/Fonts'

import { apolloClient } from 'api/snapshotApi'

import { connectors, provider } from 'lib/utils/web3'

import { NewoProvider } from 'store/contexts/newoContext'
import { ContractProvider } from 'store/contexts/contractContext'

import 'styles/date-range-picker.css'
import 'styles/custom-table.css'

import theme from 'theme'

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  ...(typeof window !== 'undefined' && {
    storage: createStorage({
      key: 'neworder',
      storage: window.localStorage,
    }),
  }),
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <ContractProvider>
          <NewoProvider>
            <ApolloProvider client={apolloClient}>
              <Fonts />
              <NextNProgress
                color="#9E00FF"
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
                options={{
                  showSpinner: false,
                }}
              />
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Component {...pageProps} />
              </ErrorBoundary>
            </ApolloProvider>
          </NewoProvider>
        </ContractProvider>
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default App
