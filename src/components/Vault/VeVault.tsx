import {
  Box,
  Button,
  Flex,
  InputRightAddon,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import Input from 'components/Forms/Input'
import StatusAmount from 'components/Vault/StatusAmount'

import useVeVault from 'hooks/useVeVault'
import useToken from 'hooks/useToken'

import { numberFormatter } from 'lib/utils/format'

import { VaultProps } from 'constants/vaults'

const VeVault = ({
  label,
  vaultAddress,
  tokenAddress,
  token0,
  token1,
  isLegacyVault,
}: VaultProps) => {
  const {
    assetBalanceOf,
    vaultAllowance,
    approveVault,
    deposit: depositFn,
    totalSupplyBalance,
    APR,
    APRLoading,
    loading,
  } = useVeVault(vaultAddress, tokenAddress, token0, token1)
  const { data: accountData } = useAccount()
  const token = useToken(tokenAddress)

  const [userVaultBalance, setUserVaultBalance] = useState('')
  const [deposit, setDeposit] = useState('')
  const [tokenBalance, setTokenBalance] = useState('')
  const [allowance, setAllowance] = useState('')

  const onMax = async () => {
    if (accountData?.address) {
      const tokenBalance = await token?.balanceOf(accountData?.address)
      setDeposit(tokenBalance)
    }
  }

  const updateTokenBalance = async () => {
    if (accountData?.address) {
      const tokenBalance = await token?.balanceOf(accountData?.address)
      setTokenBalance(tokenBalance)
    }
  }

  const updateAllowance = async () => {
    if (accountData?.address) {
      const vaultAllowanceBalance = await vaultAllowance(accountData?.address)
      setAllowance(vaultAllowanceBalance)
    }
  }

  const getUserVaultBalance = async () => {
    if (accountData?.address) {
      const balance = await assetBalanceOf(accountData?.address)

      setUserVaultBalance(balance)
    }
  }

  const updateState = async () => {
    await Promise.all([
      updateTokenBalance(),
      updateAllowance(),
      getUserVaultBalance(),
    ])
  }

  useEffect(() => {
    updateState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, accountData?.address])

  const onSubmit = async () => {
    if (Number(deposit) > Number(allowance) || Number(allowance) === 0) {
      await approveVault()
      await updateState()
    } else {
      if (accountData?.address) {
        await depositFn(deposit, accountData?.address)
        await updateState()
        setDeposit('')
      }
    }
  }

  return (
    <Box bg="gray.90" borderRadius="lg" position="relative">
      <Flex
        p="6"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        flex="wrap"
        gap="3"
      >
        <Text fontWeight="bold">{label}</Text>
        <Text fontSize="xs" color="gray.50" mt="4" mb="-2">
          APR
        </Text>

        <Text fontSize="3xl" fontWeight="extrabold" color="green.50" mb="4">
          {APRLoading ? (
            <Skeleton
              height="36px"
              w="100px"
              startColor="gray.80"
              endColor="gray.85"
              mt="2"
            />
          ) : (
            <>
              {!APR || APR === 'Infinity' ? 'NaN' : APR}
              <Text fontSize="sm" display="inline-flex" ml="1">
                %
              </Text>
            </>
          )}
        </Text>
      </Flex>
      <Box bg="gray.85" borderBottomRadius="lg">
        <Stack p="6" spacing="4">
          <Input
            formControlWidth="full"
            formLabelColor="gray.60"
            formLabelBgColor="gray.85"
            id="vault-deposit-amount"
            value={deposit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              return setDeposit(e.target.value)
            }}
            isDisabled={
              !accountData?.address || loading || isLegacyVault ? true : false
            }
            type="number"
            formLabelFontSize="0.8rem"
            label={`Amount(${token?.tokenSymbol})`}
            inputRightAddOn={
              <InputRightAddon
                onClick={async () => {
                  await onMax()
                }}
                pointerEvents={accountData?.address ? 'all' : 'none'}
                fontSize="0.7rem"
                cursor="pointer"
                _hover={{
                  bg: 'gray.60',
                }}
                // eslint-disable-next-line react/no-children-prop
                children="MAX"
              />
            }
          />
          <Stack spacing={2}>
            <StatusAmount
              label="Your Balance:"
              data={`${numberFormatter(tokenBalance, 4)} ${token?.tokenSymbol}`}
            />
            <StatusAmount
              label="Your Deposit:"
              data={`${numberFormatter(userVaultBalance, 4)} ${
                token?.tokenSymbol
              }`}
            />
            <StatusAmount
              label="Total Vault Balance:"
              data={`${numberFormatter(totalSupplyBalance, 4)} ${
                token?.tokenSymbol
              }`}
            />
          </Stack>
          <Button
            fontSize="0.8rem"
            fontWeight="bold"
            variant="greenButton"
            disabled={
              !accountData?.address ||
              loading ||
              (!deposit && Number(allowance) > 0) ||
              (Number(deposit) > Number(allowance) || Number(allowance) === 0
                ? false
                : isLegacyVault)
            }
            onClick={() => {
              onSubmit()
            }}
            loadingText={
              Number(deposit) > Number(allowance) || Number(allowance) === 0
                ? 'Approving'
                : 'Depositing'
            }
            isLoading={loading}
          >
            {Number(deposit) > Number(allowance) || Number(allowance) === 0
              ? 'Approve'
              : 'Deposit'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default VeVault
