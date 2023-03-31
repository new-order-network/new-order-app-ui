import { Button, HStack, Tooltip } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import { Td, Tr } from 'components/Table'

import useToken from 'hooks/useToken'
import useVeVault from 'hooks/useVeVault'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

interface RegistrationRewardProps {
  columns: string[]
  actions?: string[]
  veVaultAddress?: `0x${string}`
  tokenAddress?: `0x${string}`
  token0?: `0x${string}`
  token1?: `0x${string}`
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
  const { address } = useAccount()
  const {
    multiplier,
    unlockDate,
    balance: veNewoBalance,
    loading: veNewoLoading,
    depositUserStatus,
  } = useVeNewoContext()
  const veVault = useVeVault(veVaultAddress, tokenAddress, token0, token1)
  const token = useToken(tokenAddress)
  const [boost, setBoost] = useState('1.00')
  const [isRegistered, setIsRegistered] = useState(false)

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

  const checkRegistrationStatus = async () => {
    if (address) {
      if (depositUserStatus) {
        if (veVaultAddress && !depositUserStatus.includes(veVaultAddress)) {
          setIsRegistered(true)
        }
      } else if (token0 && token1 && Number(multiplier) === Number(boost)) {
        const assetBalance = veVault.assetBalance
        if (Number(assetBalance) > 0) {
          setIsRegistered(true)
        }
      } else if (!token0 && !token1) {
        const accounts = await veVault?.accounts(address)

        if (accounts) {
          const dueDate = accounts?.dueDate?.toNumber()
          if (dueDate === unlockDate && unlockDate !== 0 && dueDate !== 0) {
            setIsRegistered(true)
          } else {
            setIsRegistered(false)
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
  }, [address, veVault])

  useEffect(() => {
    checkRegistrationStatus()
    // eslint-disable-next-line
  }, [multiplier, boost, unlockDate, address, veVault, depositUserStatus])

  const register = async () => {
    await veVault.notifyDeposit()
    await veVault.updateState()
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
            {actions?.includes('deposit') && (
              <Button
                onClick={() => {
                  router.push('/invest')
                }}
                variant="greenButton"
              >
                Deposit
              </Button>
            )}
            {actions?.includes('register') && (
              <Tooltip
                label="You have updated your veNEWO lock information and will need to register for rewards"
                isDisabled={isRegistered || !!!unlockDate}
              >
                <Button
                  onClick={register}
                  isLoading={veVault.loading}
                  isDisabled={
                    !address ||
                    isRegistered ||
                    veVault.loading ||
                    Number(veNewoBalance) === 0 ||
                    veNewoLoading
                  }
                  variant="greenButton"
                >
                  {isRegistered ? 'Registered' : 'Register'}
                </Button>
              </Tooltip>
            )}
          </HStack>
        </Td>
      )}
    </Tr>
  )
}

export default RegistrationReward
