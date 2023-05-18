import {
  Box,
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
import AirdropReward from 'components/VeNewo/AirdropReward'

import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useContractContext } from 'store/contexts/contractContext'

import veNewoRewardsAvaxMerkleRoot from 'constants/airdrop/veNewoRewardsAvaxMerkleRoot.json'
import veNewoRewardsEthMerkleRoot from 'constants/airdrop/veNewoRewardsEthMerkleRoot.json'

const Claim = () => {
  const { address } = useAccount()
  const { contracts } = useContractContext()
  const { assetBalance, balance, multiplier } = useVeNewoContext()

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
        <Text fontSize="xl" color="brand.green">
          Rewards Information
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
                <Th>Claimable Rewards</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contracts.VE_NEWO_ETH_REWARDS_AIRDROP && (
                <AirdropReward
                  tokenAddress={contracts.NEWO}
                  distributorAddress={contracts.VE_NEWO_ETH_REWARDS_AIRDROP}
                  merkleRoot={veNewoRewardsEthMerkleRoot}
                />
              )}
              {contracts.VE_NEWO_AVAX_REWARDS_AIRDROP && (
                <AirdropReward
                  tokenAddress={contracts.NEWO}
                  distributorAddress={contracts.VE_NEWO_AVAX_REWARDS_AIRDROP}
                  merkleRoot={veNewoRewardsAvaxMerkleRoot}
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
