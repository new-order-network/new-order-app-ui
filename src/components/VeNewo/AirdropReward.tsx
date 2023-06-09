import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import useToken from 'hooks/useToken'
import useVeAirdropReward from 'hooks/useVeAirdropReward'

import { useContractContext } from 'store/contexts/contractContext'

interface AirdropRewardProps {
  distributorAddress?: `0x${string}`
  tokenAddress?: `0x${string}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merkleRoot: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousMerkleRoot: any
}

const currentSnapshotDate = 'June 02, 2023 - June 09, 2023'

const AirdropReward: React.FC<AirdropRewardProps> = ({
  distributorAddress,
  previousMerkleRoot,
  tokenAddress,
  merkleRoot,
}) => {
  const { contracts } = useContractContext()
  const airdrop = useVeAirdropReward(
    merkleRoot,
    previousMerkleRoot,
    tokenAddress,
    distributorAddress
  )
  const token = useToken(tokenAddress)
  const [claimableAmount, setClaimableAmount] = useState(0)

  useEffect(() => {
    if (airdrop) {
      const claimable =
        Number(airdrop?.airdropAmount) - Number(airdrop?.claimableRewards)

      setClaimableAmount(claimable)
    }
  }, [airdrop])

  const airdropContent = () => {
    if (airdrop.isUpdating) {
      return (
        <Tr>
          <Td colSpan={5} h={24} color="brand.orange">
            Vaults are undergoing scheduled maintenance. Please check back soon.
          </Td>
        </Tr>
      )
    } else {
      return (
        <Tr>
          <Td>{token.tokenSymbol}</Td>
          <Td>{airdrop.APR ?? '0'} %</Td>
          <Td>
            {Number(claimableAmount).toFixed(4)} {token.tokenSymbol}
          </Td>
          <Td>
            <Button
              onClick={airdrop.claim}
              isLoading={airdrop.loading}
              disabled={
                !airdrop.isEligible ||
                Number(claimableAmount) === 0 ||
                airdrop.loading
              }
              loadingText="Claiming"
              variant="greenButton"
            >
              Claim Rewards
            </Button>
          </Td>
          <Td></Td>
        </Tr>
      )
    }
  }

  return (
    <>
      <Text fontSize="sm" color="gray.50">
        {airdrop?.isUpdating
          ? 'For the time being rewards are distributed on a weekly basis.'
          : `The vault rewards for this week (${currentSnapshotDate}) has been updated. For the time being rewards are distributed on a weekly basis.`}
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
              <Th>APR</Th>
              <Th>Claimable Rewards</Th>
              <Th>Actions</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {contracts.VE_NEWO_REWARDS_AIRDROP &&
              merkleRoot &&
              previousMerkleRoot &&
              airdropContent()}
          </Tbody>
        </Table>
      </Box>
    </>
  )
}

export default AirdropReward
