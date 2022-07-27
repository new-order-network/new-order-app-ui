import { Box } from '@chakra-ui/react'

import WalletWidget from 'components/WalletWidget/WalletWidget'

interface ConnectOverlayProps {
  children: React.ReactNode
  isConnected: boolean
}

const ConnectOverlay: React.FC<ConnectOverlayProps> = ({
  isConnected,
  children,
}) => {
  return (
    <Box pos="relative" borderRadius="md">
      <Box
        pos="absolute"
        top="50%"
        left="50%"
        transform="auto"
        translateX="-50%"
        translateY="-50%"
        zIndex="3"
        display={isConnected ? 'none' : 'block'}
      >
        <WalletWidget />
      </Box>

      <Box
        display={isConnected ? 'none' : 'block'}
        bg="blackAlpha.300"
        backdropFilter="blur(5px)"
        borderRadius="md"
        zIndex="2"
        pos="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
      />
      <Box zIndex="1">{children}</Box>
    </Box>
  )
}

export default ConnectOverlay
