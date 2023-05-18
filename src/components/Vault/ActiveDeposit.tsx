import { Button, Flex, Icon, Skeleton, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { Td, Tr } from 'components/Table'
import ModalOverlay from 'components/ModalOverlay'
import WithdrawModal from 'components/Vault/WithdrawModal'

import useToken from 'hooks/useToken'
import useVault from 'hooks/useVault'

import { numberFormatter } from 'lib/utils/format'

import { ACTIVE_VAULT_DEPOSIT_ACTIONS } from 'models/types'

import { VaultProps } from 'constants/vaults'

import DepositIcon from 'assets/icons/Deposit.svg'

const ActiveDeposit = ({
  label,
  vaultAddress,
  tokenAddress,
  token0,
  token1,
  isLegacyVault,
  isLegacyLPVault,
}: VaultProps) => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = useState(<ModalOverlay />)
  const token = useToken(tokenAddress)
  const { address } = useAccount()
  const {
    balanceOf,
    earned,
    withdraw,
    getReward,
    exit,
    APR,
    APRLoading,
    loading,
  } = useVault(vaultAddress, tokenAddress, token0, token1)

  const [earnedRewards, setEarnedRewards] = useState('')
  const [userVaultBalance, setUserVaultBalance] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [actionType, setActionType] = useState<ACTIVE_VAULT_DEPOSIT_ACTIONS>()

  const actionItems = () => {
    return (
      <Flex flexWrap="wrap" gap="2" alignItems="center">
        <Button
          fontSize="0.7rem"
          leftIcon={<Icon fontSize="20px" as={DepositIcon} />}
          variant="outlineGrayRounded"
          w={['full', 'auto']}
          justifyContent={['flex-start', 'center']}
          onClick={() => {
            setActionType(ACTIVE_VAULT_DEPOSIT_ACTIONS.WITHDRAW)
            setOverlay(<ModalOverlay />)
            onOpen()
          }}
          loadingText="Withdrawing"
          isLoading={
            loading && actionType === ACTIVE_VAULT_DEPOSIT_ACTIONS.WITHDRAW
          }
          disabled={
            (isLegacyVault && !isLegacyLPVault) ||
            loading ||
            !address ||
            Number(userVaultBalance) === 0
          }
        >
          Withdraw
        </Button>
        <Button
          fontSize="0.7rem"
          leftIcon={<Icon fontSize="20px" as={DepositIcon} />}
          variant="outlineGrayRounded"
          w={['full', 'auto']}
          justifyContent={['flex-start', 'center']}
          py="1"
          isLoading={
            loading && actionType === ACTIVE_VAULT_DEPOSIT_ACTIONS.CLAIM
          }
          loadingText="Claiming"
          disabled={
            isLegacyVault || loading || !address || Number(earnedRewards) === 0
          }
          onClick={async () => {
            setActionType(ACTIVE_VAULT_DEPOSIT_ACTIONS.CLAIM)
            if (address) {
              await getReward()
              await updateState()
            }
          }}
        >
          Claim
        </Button>
        <Button
          fontSize="0.7rem"
          leftIcon={<Icon fontSize="20px" as={DepositIcon} />}
          variant="outlineGrayRounded"
          w={['full', 'auto']}
          justifyContent={['flex-start', 'center']}
          isLoading={
            loading &&
            actionType === ACTIVE_VAULT_DEPOSIT_ACTIONS.WITHDRAW_AND_CLAIM
          }
          disabled={
            isLegacyLPVault ||
            loading ||
            !address ||
            Number(earnedRewards) === 0 ||
            (Number(userVaultBalance) === 0 && Number(earnedRewards) === 0)
          }
          loadingText="Withdrawing & Claiming"
          onClick={async () => {
            setActionType(ACTIVE_VAULT_DEPOSIT_ACTIONS.WITHDRAW_AND_CLAIM)
            if (address) {
              await exit()
              await updateState()
            }
          }}
        >
          Withdraw & Claim
        </Button>
      </Flex>
    )
  }

  const withdrawTokens = async () => {
    if (address) {
      await withdraw(withdrawAmount)
      await updateState()
      setWithdrawAmount('')
      onClose()
    }
  }

  const updateUserVaultBalance = async () => {
    if (address) {
      const balance = await balanceOf(address)

      setUserVaultBalance(balance)
    }
  }

  const updateEarnedRewards = async () => {
    if (address) {
      const rewards = await earned(address)
      setEarnedRewards(rewards)
    }
  }

  const updateState = async () => {
    await Promise.all([updateEarnedRewards(), updateUserVaultBalance()])
  }

  useEffect(() => {
    updateState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, address])

  return (
    <>
      <Tr>
        <Td>{label}</Td>
        <Td>
          {numberFormatter(userVaultBalance, 4)} {token?.tokenSymbol}
        </Td>
        <Td>
          {numberFormatter(isLegacyLPVault ? '0' : earnedRewards, 4)} NEWO
        </Td>
        <Td color="green.100">
          {APRLoading ? (
            <Skeleton
              height="28px"
              w="100px"
              startColor="gray.80"
              endColor="gray.85"
              mt="2"
            />
          ) : !APR || APR === 'Infinity' ? (
            'NaN'
          ) : isLegacyVault ? (
            'NaN'
          ) : (
            `${APR}%`
          )}
        </Td>
        <Td>{actionItems()}</Td>
      </Tr>
      <WithdrawModal
        isOpen={isOpen}
        onClose={onClose}
        overlay={overlay}
        currentDeposit={userVaultBalance}
        tokenSymbol={token?.tokenSymbol}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        withdrawTokens={withdrawTokens}
        loading={loading}
      />
    </>
  )
}
export default ActiveDeposit
