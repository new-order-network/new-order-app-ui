import {
  Box,
  Button,
  Flex,
  Grid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'

import Card from 'components/Card'
import ConnectOverlay from 'components/ConnectOverlay'
import LockedToken from 'components/VeNewo/LockedToken'
import RegisteredReward from 'components/VeNewo/RegisteredReward'

import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useContractContext } from 'store/contexts/contractContext'

const Claim = () => {
  const { address } = useAccount()
  const { contracts } = useContractContext()
  const {
    assetBalance,
    balance,
    multiplier,
    totalRewardsEarned,
    loading: veNewoLoading,
    getAllRewards,
  } = useVeNewoContext()

  return (
    <ConnectOverlay isConnected={!!address}>
      <Grid templateColumns={['1fr', '1fr', '1fr', 'repeat(3,1fr)']} gap="3">
        <Card variant="simple">
          <Stat>
            <StatLabel fontSize="lg">Your locked NEWO</StatLabel>
            <StatNumber color="brand.green" fontSize="2xl">
              {Number(assetBalance).toFixed(4)}
            </StatNumber>
          </Stat>
        </Card>
        <Card variant="simple">
          <Stat>
            <StatLabel fontSize="lg">Your veNEWO balance</StatLabel>
            <StatNumber color="brand.green" fontSize="2xl">
              {Number(balance).toFixed(4)}
            </StatNumber>
          </Stat>
        </Card>
        <Card variant="simple">
          <Stat>
            <StatLabel fontSize="lg">Your Multiplier</StatLabel>
            <StatNumber color="brand.green" fontSize="2xl">
              {multiplier}x
            </StatNumber>
          </Stat>
        </Card>
      </Grid>

      <Stack my="6">
        <Text fontSize="xl" color="brand.green">
          Locked Tokens Information
        </Text>

        <Box
          border="1px solid"
          borderColor="gray.80"
          borderRadius="8"
          overflow="hidden"
        >
          <Table variant="grayStriped">
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th>Amount Locked</Th>
                <Th>Unlock Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <LockedToken
                veTokenAddress={contracts.VENEWO}
                tokenAddress={contracts.NEWO}
              />
            </Tbody>
          </Table>
        </Box>
      </Stack>

      <Stack my="6">
        <Flex justify="space-between">
          <Text fontSize="xl" color="brand.green">
            Rewards Information
          </Text>

          <Button
            variant="greenButton"
            onClick={getAllRewards}
            isDisabled={Number(totalRewardsEarned) <= 0}
            isLoading={veNewoLoading}
          >
            Claim All Rewards
          </Button>
        </Flex>

        <Box
          border="1px solid"
          borderColor="gray.80"
          borderRadius="8"
          overflow="hidden"
        >
          <Table variant="grayStriped">
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th>AVG APR</Th>
                <Th>Boost</Th>
                <Th>Rewards Earned</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <RegisteredReward
                veVaultAddress={contracts.VE_NEWO_SINGLE_SIDE_VAULT}
                tokenAddress={contracts.NEWO}
              />

              {contracts.VE_NEWO_USDC_LP_VAULT &&
                contracts.VE_NEWO_USDC_LP_VAULT !== '0x' && (
                  <RegisteredReward
                    veVaultAddress={contracts.VE_NEWO_USDC_LP_VAULT}
                    tokenAddress={contracts.NEWO_USDC_LP}
                    token0={contracts.NEWO}
                    token1={contracts.USDC}
                  />
                )}

              {contracts.VE_NEWO_WAVAX_LP_VAULT &&
                contracts.VE_NEWO_WAVAX_LP_VAULT !== '0x' && (
                  <RegisteredReward
                    veVaultAddress={contracts.VE_NEWO_WAVAX_LP_VAULT}
                    tokenAddress={contracts.NEWO_WAVAX_LP}
                    token0={contracts.NEWO}
                    token1={contracts.WAVAX}
                  />
                )}
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </ConnectOverlay>
  )
}

export default Claim
