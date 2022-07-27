import {
  AspectRatio,
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Skeleton,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

import ModalOverlay from 'components/ModalOverlay'

import { getIconForNetwork } from 'lib/utils/wallet'
import { env } from 'lib/environment'

import { useContractContext } from 'store/contexts/contractContext'

import { SUPPORTED_NETWORKS } from 'constants/network'

const NetworkButton = () => {
  const toast = useToast()
  const { isOpen, onOpen, onClose, hasNetworkError } = useContractContext()
  const [overlay, setOverlay] = useState(<ModalOverlay />)

  const {
    activeChain: networkData,
    error: switchNetworkError,
    isLoading,
    switchNetwork,
  } = useNetwork()

  const changeNetworkAndClose = (networkId: number) => {
    if (switchNetwork) {
      switchNetwork(networkId)
    }

    onClose()
  }

  useEffect(() => {
    if (switchNetworkError?.message) {
      toast({
        title: 'Switching Network Failed',
        description: switchNetworkError?.message,
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchNetworkError?.message])

  return (
    <>
      <Flex
        onClick={() => {
          setOverlay(<ModalOverlay />)
          onOpen()
        }}
        alignItems="center"
        gap="3"
        ml={['2', 0]}
        flexWrap="wrap"
      >
        <Box
          w="2.5rem"
          h="2.5rem"
          border="1px"
          borderColor="gray.65"
          borderRadius="md"
          cursor="pointer"
          p="6px"
          transition="all 0.3s ease"
          _hover={{
            bgColor: 'gray.85',
          }}
          mr="2"
        >
          <AspectRatio ratio={1 / 1} position="relative">
            <Image
              borderRadius="md"
              bg="gray.85"
              src={getIconForNetwork(networkData?.id, 'source')}
              alt={getIconForNetwork(networkData?.id, 'alt')}
            />
          </AspectRatio>
        </Box>
        <Text display={['inline-flex', 'none']} fontSize="0.9rem">
          {networkData?.name}
        </Text>
      </Flex>
      <Modal
        isCentered
        motionPreset="scale"
        isOpen={hasNetworkError ? hasNetworkError : isOpen}
        onClose={onClose}
        closeOnOverlayClick={hasNetworkError ? hasNetworkError : true}
      >
        {overlay}
        <ModalContent
          bgColor="gray.100"
          color="white"
          border="1px"
          borderRadius="md"
          borderColor="gray.90"
        >
          <ModalHeader fontSize="0.9rem">
            Select a supported network
          </ModalHeader>
          <ModalCloseButton
            mt="0.5"
            _focus={{ boxShadow: 'none' }}
            _hover={{ color: 'brand.red' }}
          />
          <Divider />
          <ModalBody py="4" w="full">
            {isLoading
              ? Array.from(Array(3).keys()).map((i: number) => {
                  return (
                    <Skeleton
                      key={i}
                      borderRadius="sm"
                      h="50px"
                      w="full"
                      startColor="gray.80"
                      endColor="gray.85"
                      mb="2"
                    />
                  )
                })
              : switchNetwork &&
                SUPPORTED_NETWORKS.filter((x) => {
                  if (env.isDev || env.isDevelopment || env.isTest) {
                    return x
                  } else if (env.isProd || env.isProduction) {
                    return x.testnet === false
                  }
                  return x.testnet === false
                }).map((x) => {
                  return x.id === networkData?.id ? null : (
                    <HStack
                      onClick={() => {
                        changeNetworkAndClose(x.id)
                      }}
                      key={x.id}
                      _hover={{
                        backgroundColor: 'gray.85',
                      }}
                      transition="0.3s ease all"
                      cursor="pointer"
                      p="4"
                      borderRadius="md"
                    >
                      <Box w="2rem" h="2rem" mr="2">
                        <AspectRatio ratio={1 / 1} position="relative">
                          <Image
                            borderRadius="md"
                            bg="gray.85"
                            src={getIconForNetwork(x.id, 'source')}
                            alt={getIconForNetwork(x.id, 'alt')}
                          />
                        </AspectRatio>
                      </Box>
                      <Text fontSize="0.9rem">
                        {'Switch to '}
                        {x.name}
                      </Text>
                    </HStack>
                  )
                })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NetworkButton
