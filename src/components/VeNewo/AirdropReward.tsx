import { Button, Td, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import useToken from 'hooks/useToken'
import useVeAirdropReward from 'hooks/useVeAirdropReward'

import { AirdropProps } from 'constants/airdrop/airdrops'

const AirdropReward: React.FC<AirdropProps> = ({
  distributorAddress,
  previousMerkleRoot,
  tokenAddress,
  merkleRoot,
}) => {
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
  return (
    <Tr>
      <Td>{token.tokenSymbol}</Td>
      <Td>{airdrop.APR} %</Td>
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
          variant="greenButton"
        >
          Claim Rewards
        </Button>
      </Td>
      <Td></Td>
    </Tr>
  )
}

export default AirdropReward
