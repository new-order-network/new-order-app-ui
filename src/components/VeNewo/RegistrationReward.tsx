import { Button, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import { Td, Tr } from 'components/Table'

import useToken from 'hooks/useToken'
import useVeVault from 'hooks/useVeVault'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

interface RegistrationRewardProps {
  columns: string[]
  actions: string[]
  veVaultAddress?: string
  tokenAddress?: string
  token0?: string
  token1?: string
}

const RegistrationReward: React.FC<RegistrationRewardProps> = ({
  columns,
  actions,
  veVaultAddress,
  tokenAddress,
  token0,
  token1,
}) => {
  const router = useRouter()
  const accountData = useAccount()
  const { multiplier, unlockDate } = useVeNewoContext()
  const veVault = useVeVault(veVaultAddress, tokenAddress, token0, token1)
  const token = useToken(tokenAddress)
  const [boost, setBoost] = useState('1.00')
  const [isRegistered, setIsRegistered] = useState(false)

  const calculateBoost = async () => {
    if (accountData?.address) {
      const assetBalance = await veVault.assetBalanceOf(accountData?.address)
      const balance = await veVault.balanceOf(accountData?.address)
      const boost = Number(balance) / Number(assetBalance)

      if (Number.isFinite(boost)) {
        setBoost(boost.toFixed(2))
      }
    }
  }

  const checkRegistrationStatus = async () => {
    if (accountData?.address) {
      if (token0 && token1 && Number(multiplier) === Number(boost)) {
        setIsRegistered(true)
      } else if (!token0 && !token1) {
        const accounts = await veVault?.accounts(accountData?.address)

        if (accounts) {
          const dueDate = accounts?.dueDate?.toNumber()
          if (dueDate === unlockDate && unlockDate !== 0 && dueDate !== 0) {
            setIsRegistered(true)
          }
        }
      } else {
        setIsRegistered(false)
      }
    }
  }

  useEffect(() => {
    calculateBoost()
    // eslint-disable-next-line
  }, [accountData?.address, veVault])

  useEffect(() => {
    checkRegistrationStatus()
    // eslint-disable-next-line
  }, [multiplier, boost, unlockDate, accountData?.address])

  const register = async () => {
    await veVault.notifyDeposit()
    await checkRegistrationStatus()
  }

  return (
    <Tr>
      {columns.includes('name') && <Td>{token.tokenSymbol}</Td>}
      {columns.includes('apr') && <Td>{veVault.APR}%</Td>}
      {columns.includes('boost') && <Td>{boost}x</Td>}
      {columns.includes('actions') && (
        <Td>
          <HStack spacing="2">
            {actions.includes('deposit') && (
              <Button
                onClick={() => {
                  router.push('/invest')
                }}
                variant="greenButton"
              >
                Deposit
              </Button>
            )}
            {actions.includes('register') && (
              <Button
                onClick={register}
                isLoading={veVault.loading}
                disabled={
                  !accountData?.address || isRegistered || veVault.loading
                }
                isDisabled={veVault.loading}
                variant="greenButton"
              >
                {isRegistered ? 'Registered' : 'Register'}
              </Button>
            )}
          </HStack>
        </Td>
      )}
    </Tr>
  )
}

export default RegistrationReward
