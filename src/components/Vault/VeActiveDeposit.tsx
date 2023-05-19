import { useState } from 'react'
import { Button, Flex, Icon, Skeleton, useDisclosure } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

import { Td, Tr } from 'components/Table'
import ModalOverlay from 'components/ModalOverlay'
import WithdrawModal from 'components/Vault/WithdrawModal'

import useToken from 'hooks/useToken'
import useVeVault from 'hooks/useVeVault'

import { numberFormatter } from 'lib/utils/format'

import { ACTIVE_VAULT_DEPOSIT_ACTIONS } from 'models/types'

import { VaultProps } from 'constants/vaults'

import DepositIcon from 'assets/icons/Deposit.svg'
const VeActiveDeposit = ({
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
  const { address } = useAccount()
  const token = useToken(tokenAddress)
  const {
    assetBalance,
    earned,
    withdraw,
    getReward,
    exit,
    APR,
    loading,
    updateState,
  } = useVeVault(vaultAddress, tokenAddress, token0, token1)

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
          isLoading={
            loading && actionType === ACTIVE_VAULT_DEPOSIT_ACTIONS.WITHDRAW
          }
          onClick={() => {
            setActionType(ACTIVE_VAULT_DEPOSIT_ACTIONS.WITHDRAW)
            setOverlay(<ModalOverlay />)
            onOpen()
          }}
          disabled={
            isLegacyVault || loading || !address || Number(assetBalance) === 0
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
            isLegacyVault || loading || !address || Number(earned) === 0
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
            Number(earned) === 0 ||
            (Number(assetBalance) === 0 && Number(earned) === 0)
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
      await withdraw(withdrawAmount, address)
      await updateState()
      setWithdrawAmount('')
      onClose()
    }
  }

  return (
    <>
      <Tr>
        <Td>{label}</Td>
        <Td>
          {numberFormatter(assetBalance, 4)} {token?.tokenSymbol}
        </Td>
        <Td>{numberFormatter(isLegacyLPVault ? '0' : earned, 4)} NEWO</Td>
        <Td color="green.100">
          {loading ? (
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
        currentDeposit={assetBalance}
        tokenSymbol={token?.tokenSymbol}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        withdrawTokens={withdrawTokens}
        loading={loading}
      />
    </>
  )
}
export default VeActiveDeposit
