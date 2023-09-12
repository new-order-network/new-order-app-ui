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

const currentSnapshotDate = 'August 18, 2023 - August 25, 2023'

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
          <Td colSpan={6} h={24} color="brand.orange">
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
            {Number(airdrop.airdropAmountDifference) > 0 ? (
              <>
                <Text fontSize="sm" color="brand.green">
                  +{airdrop.airdropAmountDifference} {token.tokenSymbol}
                </Text>
                <Text
                  fontSize="xs"
                  mt={1}
                  textTransform="uppercase"
                  color="gray.50"
                >
                  (Buyback: 24.9%, Emissions: 75.1%)
                </Text>
              </>
            ) : (
              <>0.0000 {token.tokenSymbol}</>
            )}
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

  // : `The vault rewards for this week (${currentSnapshotDate}) have been updated. This week's APR is 100% from emissions, and there will be another buyback next week. For the time being rewards are distributed on a weekly basis with rewards from buybacks occurring on every second week. We are taking additional steps to present the APR in a smoother way.`}
  return (
    <>
      <Text fontSize="sm" color="gray.50">
        {airdrop?.isUpdating
          ? 'For the time being rewards are distributed on a weekly basis.'
          : `Since the merger proposal passed, and all veNEWO is now unlocked there are no further rewards.`}
        {/* NOTE Put this back for next week `The vault rewards for this week (${currentSnapshotDate}) has been updated. For the time being rewards are distributed on a weekly basis.` */}
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
              <Th>Earned Since Last week</Th>
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
