import { useState } from 'react'
import {
  AspectRatio,
  HStack,
  Link,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import Image from 'next/image'

import ModalOverlay from 'components/ModalOverlay'

import { exchanges } from 'constants/newo'

const BuyNewoButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = useState(<ModalOverlay />)

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader fontSize="lg">Buy $NEWO</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack>
              {exchanges.map((exchange) => {
                return (
                  <Link
                    key={exchange.label}
                    href={exchange.link}
                    variant="orangeTransition"
                    color="white"
                    isExternal
                    fontSize="lg"
                    borderRadius="md"
                    p={['2', '4']}
                    _hover={{ bgColor: 'gray.80' }}
                  >
                    <HStack gap="1">
                      <AspectRatio ratio={1 / 1} pos="relative" w="10">
                        <Image
                          src={exchange.icon}
                          alt={exchange.label}
                          layout="fill"
                        />
                      </AspectRatio>

                      <Text>{exchange.label}</Text>
                    </HStack>
                  </Link>
                )
              })}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <MenuItem
        onClick={() => {
          onOpen()
          setOverlay(<ModalOverlay />)
        }}
        _hover={{
          color: 'brand.orange',
        }}
      >
        Buy $NEWO
      </MenuItem>
    </>
  )
}

export default BuyNewoButton
