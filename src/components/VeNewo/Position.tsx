import { Flex, Stack, Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

import Card from 'components/Card'
import ConnectOverlay from 'components/ConnectOverlay'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

const Position = () => {
  const { data: accountData } = useAccount()
  const { balance, assetBalance, multiplier } = useVeNewoContext()

  if (!balance && !assetBalance && !multiplier) {
    return <></>
  }

  return (
    <Stack spacing="3">
      <Text fontSize="lg">My Position</Text>
      <ConnectOverlay isConnected={!!accountData?.address}>
        <Card border="1px solid" borderColor="brand.green" p="5">
          <Stack spacing="1">
            <Flex align="center" justify="space-between">
              <Text>NEWO Locked</Text>
              <Text color="brand.green">{assetBalance}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text>veNEWO Balance</Text>
              <Text color="brand.green">{balance}</Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text>Multiplier</Text>
              <Text color="brand.green">{multiplier}x</Text>
            </Flex>
          </Stack>
        </Card>
      </ConnectOverlay>
    </Stack>
  )
}

export default Position
