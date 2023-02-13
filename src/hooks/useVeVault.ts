import { useToast } from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useNetwork, useProvider, useSigner } from 'wagmi'

import useVault from 'hooks/useVault'
import useToken from 'hooks/useToken'

import { getTokenPriceByAddress } from 'lib/utils/tokens'

import { useNewoContext } from 'store/contexts/newoContext'
import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useContractContext } from 'store/contexts/contractContext'

import { YEAR_IN_SECONDS } from 'constants/numbers'

import veVaultAbi from 'contracts/abi/xNewo.json'

interface Account {
  rewardPerTokenPaid: BigNumber
  rewards: BigNumber
  dueDate: BigNumber
}

interface UseVeVaultProps {
  balanceOf: (address: string) => Promise<string>
  approveVault: () => Promise<void>
  assetBalanceOf: (address: string) => Promise<string>
  vaultAllowance: (ownerAddress: `0x${string}`) => Promise<string>
  deposit: (amount: string, senderAddress: string) => Promise<void>
  earned: (ownerAddress: string) => Promise<string>
  withdraw: (amount: string, receiverAddress: string) => Promise<void>
  getReward: () => Promise<void>
  exit: () => Promise<void>
  notifyDeposit: () => Promise<void>
  getNewoShare: (ownerAddress: string) => Promise<string>
  accounts: (ownerAddress: string) => Promise<Account | null>
  APR: string
  APRLoading: boolean
  totalSupplyBalance: string
  loading: boolean
}

const useVeVault = (
  vaultAddress?: `0x${string}`,
  tokenAddress?: `0x${string}`,
  token0?: `0x${string}`,
  token1?: `0x${string}`
): UseVeVaultProps => {
  // TODO: to be removed
  const { contracts } = useContractContext()

  const toast = useToast()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()
  const { updateState } = useNewoContext()
  const { totalAssets: veNewoTotalAssets } = useVeNewoContext()
  const token = useToken(tokenAddress)
  const [veVaultInstance, setVeVaultInstance] =
    useState<ethers.Contract | null>(null)
  const [APR, setAPR] = useState('')

  const {
    balanceOf,
    approveVault,
    vaultAllowance,
    setLoading,
    updateBalances,
    earned,
    getReward,
    exit,
    getTvl,
    APRLoading,
    totalSupplyBalance,
    loading,
  } = useVault(vaultAddress, tokenAddress, token0, token1)

  const provider = useProvider()

  useEffect(() => {
    if (vaultAddress) {
      if (provider) {
        const instance = new ethers.Contract(vaultAddress, veVaultAbi, provider)

        if (signer) {
          const instanceWithSigner = instance?.connect(signer)
          setVeVaultInstance(instanceWithSigner)
        } else {
          setVeVaultInstance(instance)
        }
      }
    }
    // eslint-disable-next-line
  }, [vaultAddress, provider, signer])

  const getAPR = async () => {
    let calculatedApr = 0

    if (veVaultInstance) {
      const rewardRate = await veVaultInstance?.rewardRate()
      const convertedRewardRate = ethers.utils.formatUnits(rewardRate, 'ether')

      if (token0 && token1) {
        const rewardsToken = await veVaultInstance?.rewardsToken()

        const rewardTokenPrice = await getTokenPriceByAddress(
          rewardsToken,
          chain?.name
        )

        const lpTvl = await getTvl()

        calculatedApr =
          (Number(convertedRewardRate) *
            rewardTokenPrice *
            YEAR_IN_SECONDS *
            100) /
          lpTvl

        // TODO: to be removed
        // NOTE; forces the apr to be 0 when it's the avax lp vault
        if (vaultAddress === contracts.VE_NEWO_WAVAX_LP_VAULT) {
          calculatedApr = 0
        }
      } else {
        const rewardRate = await veVaultInstance.rewardRate()
        const convertedRewardRate = Number(
          ethers.utils.formatUnits(rewardRate, 'ether')
        )

        calculatedApr =
          (convertedRewardRate / Number(veNewoTotalAssets)) *
          YEAR_IN_SECONDS *
          100
      }

      if (Number.isFinite(calculatedApr)) {
        const finalApr = calculatedApr.toFixed(2)
        setAPR(finalApr)
      }
    }
  }

  const assetBalanceOf = async (address: string) => {
    // Returns the user vault balance
    try {
      const balance = await veVaultInstance?.assetBalanceOf(address)
      const decimals = token?.decimals
      const formattedBalance = ethers.utils.formatUnits(balance, decimals)

      return formattedBalance
    } catch (err) {
      return ''
    }
  }

  const deposit = async (amount: string, senderAddress: string) => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)

    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 'ether')
      const tx = await veVaultInstance?.deposit(parsedAmount, senderAddress, {
        from: senderAddress,
      })
      const receipt = await tx?.wait()

      if (receipt?.status === 1) {
        toast({
          title: 'Deposit Successful',
          description: 'You have successfully deposited your tokens.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('[DEPOSIT ERROR]', err)
      toast({
        title: 'Deposit Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    } finally {
      await updateBalances()
      await updateState?.()
      setLoading(false)
    }
  }

  const withdraw = async (amount: string, receiverAddress: string) => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)
    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 'ether')
      const tx = await veVaultInstance?.withdraw(
        parsedAmount,
        receiverAddress,
        receiverAddress,
        {
          from: receiverAddress,
        }
      )
      const receipt = await tx?.wait()

      if (receipt?.status === 1) {
        toast({
          title: 'Withdraw Successful',
          description: 'You have successfully withdrawn your tokens.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('[WITHDRAW ERROR]', err)
      toast({
        title: 'Withdraw Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    } finally {
      await updateBalances()
      await updateState?.()
      setLoading(false)
    }
  }

  useEffect(() => {
    // Update balances on first load
    if (
      veVaultInstance &&
      tokenAddress &&
      vaultAddress &&
      token.decimals !== 0
    ) {
      updateBalances()
      getAPR()
    }

    // eslint-disable-next-line
  }, [
    veVaultInstance,
    token.decimals,
    vaultAddress,
    tokenAddress,
    veNewoTotalAssets,
  ])

  const notifyDeposit = async () => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)
    try {
      const tx = await veVaultInstance?.notifyDeposit()
      const receipt = await tx?.wait()

      if (receipt?.status === 1) {
        toast({
          title: 'Registration Successful',
          description: 'You have successfully registered for rewards.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('[REGISTRATION ERROR]', err)
      toast({
        title: 'Registration Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    } finally {
      await updateBalances()
      await updateState?.()
      setLoading(false)
    }
  }

  const getNewoShare = async (ownerAddress: string) => {
    try {
      const newoShare = await veVaultInstance?.getNewoShare(ownerAddress)
      const formattedNewoShare = ethers.utils.formatUnits(
        newoShare,
        token.decimals
      )
      return formattedNewoShare
    } catch {
      return ''
    }
  }

  const accounts = async (ownerAddress: string) => {
    try {
      if (!token0 && !token1) {
        const accounts = await veVaultInstance?.accounts(ownerAddress)
        return accounts
      }
    } catch {
      return null
    }
  }

  return {
    balanceOf,
    approveVault,
    assetBalanceOf,
    vaultAllowance,
    deposit,
    earned,
    withdraw,
    getReward,
    exit,
    notifyDeposit,
    getNewoShare,
    accounts,
    APR,
    APRLoading,
    totalSupplyBalance,
    loading,
  }
}

export default useVeVault
