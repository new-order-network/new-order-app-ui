import { Button, Td, Tr } from '@chakra-ui/react'

import useToken from 'hooks/useToken'
import useVeAirdropReward from 'hooks/useVeAirdropReward'

import { AirdropProps } from 'constants/airdrop/airdrops'

const AirdropReward: React.FC<AirdropProps> = ({
  distributorAddress,
  tokenAddress,
  merkleRoot,
}) => {
  const airdrop = useVeAirdropReward(
    merkleRoot,
    tokenAddress,
    distributorAddress
  )
  const token = useToken(tokenAddress)
  return (
    <Tr>
      <Td>{token.tokenSymbol}</Td>
      <Td>{airdrop.isClaimed ? 'Yes' : 'No'}</Td>
      <Td>
        {Number(airdrop?.airdropAmount).toFixed(4)} {token.tokenSymbol}
      </Td>
      <Td>
        <Button
          onClick={airdrop.claim}
          isLoading={airdrop.loading}
          disabled={!airdrop.isEligible || airdrop.isClaimed || airdrop.loading}
          variant="greenButton"
        >
          Claim Rewards
        </Button>
      </Td>
    </Tr>
  )
}

export default AirdropReward
