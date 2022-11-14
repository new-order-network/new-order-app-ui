import {
  Box,
  Button,
  Divider,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useConnect } from 'wagmi'
import MetaMaskOnboarding from '@metamask/onboarding'

import AddressButton from 'components/WalletWidget/AddressButton'
import ModalOverlay from 'components/ModalOverlay'

import { getIconForConnector } from 'lib/utils/wallet'

import { useNewoContext } from 'store/contexts/newoContext'

const WalletWidget = ({ ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { metamaskIsInstalled, accountAddress } = useNewoContext()

  const [overlay, setOverlay] = useState(<ModalOverlay />)
  const { connectors, isLoading, connectAsync } = useConnect()

  const getBrowserPlugin = () => {
    const onboarding = new MetaMaskOnboarding()

    onboarding.startOnboarding()
  }

  return (
    <>
      <Box {...rest}>
        {accountAddress ? (
          <AddressButton />
        ) : (
          <Button
            variant="greenButton"
            onClick={() => {
              setOverlay(<ModalOverlay />)
              onOpen()
            }}
            loadingText="Connecting Wallet"
            isLoading={isLoading}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
      <Modal isCentered motionPreset="scale" isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent
          bgColor="gray.100"
          color="white"
          border="1px"
          borderRadius="md"
          borderColor="gray.90"
        >
          <ModalHeader fontSize="0.9rem">Connect Wallet</ModalHeader>
          <ModalCloseButton
            mt="0.5"
            _focus={{ boxShadow: 'none' }}
            _hover={{ color: 'brand.red' }}
          />
          <Divider />
          <ModalBody py="4">
            {connectors.map((connector) => {
              const connectorName =
                connector.id === 'injected'
                  ? connector.name
                    ? connector.name === 'Injected'
                      ? 'Metamask'
                      : connector.name
                    : connector.id
                  : connector.name === 'Injected'
                  ? 'Metamask'
                  : connector.name
              return (
                <Button
                  key={connector.id}
                  disabled={!connector.ready && connector.id !== 'injected'}
                  leftIcon={
                    <Icon
                      mr="4"
                      fontSize="36"
                      fill="white"
                      as={getIconForConnector(connector.id)}
                    />
                  }
                  variant="walletButton"
                  onClick={() => {
                    if (!connector.ready && !metamaskIsInstalled) {
                      getBrowserPlugin()
                    } else {
                      connectAsync({ connector })
                    }
                    onClose()
                  }}
                >
                  {connector.id === 'injected' && !metamaskIsInstalled ? (
                    <Text fontSize="sm">Download Metamask extension</Text>
                  ) : (
                    <>
                      <Text
                        fontSize={
                          connector.name?.includes('Injected') ? 'xs' : 'lg'
                        }
                      >
                        {connectorName}
                      </Text>
                      {!connector.ready && ' (unsupported)'}
                      {isLoading &&
                        connector.name === connector?.name &&
                        '(connecting)'}
                    </>
                  )}
                </Button>
              )
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletWidget
