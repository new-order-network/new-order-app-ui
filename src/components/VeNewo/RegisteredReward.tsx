import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { Td, Tr } from 'components/Table'

import useToken from 'hooks/useToken'
import useVeVault from 'hooks/useVeVault'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

interface RegisteredRewardProps {
  veVaultAddress?: `0x${string}`
  tokenAddress?: `0x${string}`
  token0?: `0x${string}`
  token1?: `0x${string}`
  isClaimable?: boolean
}

const RegisteredReward: React.FC<RegisteredRewardProps> = ({
  veVaultAddress,
  tokenAddress,
  token0,
  token1,
  isClaimable,
}) => {
  const { address } = useAccount()
  const { multiplier, totalRewardsEarned, loading } = useVeNewoContext()
  const token = useToken(tokenAddress)
  const veVault = useVeVault(veVaultAddress, tokenAddress, token0, token1)
  const [boost, setBoost] = useState('1.00')

  const calculateBoost = async () => {
    if (address) {
      const assetBalance = veVault.assetBalance
      const balance = veVault.balance
      const boost = Number(balance) / Number(assetBalance)

      if (Number.isFinite(boost)) {
        setBoost(boost.toFixed(2))
      }
    }
  }

  useEffect(() => {
    if (veVault) {
      veVault.updateState()
    }
  }, [totalRewardsEarned, veVault])

  useEffect(() => {
    calculateBoost()
    // eslint-disable-next-line
  }, [address, veVault])

  return (
    <Tr>
      <Td>{token.tokenSymbol}</Td>
      <Td>{veVault.APR}%</Td>
      <Td>{token0 && token1 ? boost : multiplier}x</Td>
      <Td>
        {Number(veVault.earned).toFixed(4)} {token.tokenSymbol}
      </Td>

      {isClaimable && (
        <Td>
          <Button
            onClick={veVault.getReward}
            isLoading={veVault.loading}
            isDisabled={
              !veVault.earned || Number(veVault.earned) <= 0 || loading
            }
            variant="greenButton"
          >
            Claim Rewards
          </Button>
        </Td>
      )}
    </Tr>
  )
}

export default RegisteredReward
