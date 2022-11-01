import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { Td, Tr } from 'components/Table'

import useToken from 'hooks/useToken'
import useVeVault from 'hooks/useVeVault'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

interface RegisteredRewardProps {
  veVaultAddress?: string
  tokenAddress?: string
  token0?: string
  token1?: string
}

const RegisteredReward: React.FC<RegisteredRewardProps> = ({
  veVaultAddress,
  tokenAddress,
  token0,
  token1,
}) => {
  const { address } = useAccount()
  const { multiplier } = useVeNewoContext()
  const token = useToken(tokenAddress)
  const veVault = useVeVault(veVaultAddress, tokenAddress, token0, token1)
  const [boost, setBoost] = useState('1.00')
  const [earned, setEarned] = useState('')

  const calculateBoost = async () => {
    if (address) {
      const assetBalance = await veVault.assetBalanceOf(address)
      const balance = await veVault.balanceOf(address)
      const boost = Number(balance) / Number(assetBalance)

      if (Number.isFinite(boost)) {
        setBoost(boost.toFixed(2))
      }
    }
  }

  const getEarned = async () => {
    if (address) {
      const earned = await veVault?.earned(address)
      setEarned(earned)
    }
  }

  useEffect(() => {
    calculateBoost()
    getEarned()
    // eslint-disable-next-line
  }, [address, veVault])

  return (
    <Tr>
      <Td>{token.tokenSymbol}</Td>
      <Td>{veVault.APR}%</Td>
      <Td>{token0 && token1 ? boost : multiplier}x</Td>
      <Td>{Number(earned).toFixed(4)}</Td>
      <Td>
        <Button
          onClick={veVault.getReward}
          isLoading={veVault.loading}
          disabled={!earned || Number(earned) <= 0}
          variant="greenButton"
        >
          Claim Rewards
        </Button>
      </Td>
    </Tr>
  )
}

export default RegisteredReward
