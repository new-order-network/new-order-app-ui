import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { erc20ABI, useNetwork, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers'

import useToken from 'hooks/useToken'

import { getTokenPriceByAddress } from 'lib/utils/tokens'

import { useNewoContext } from 'store/contexts/newoContext'

import vaultAbi from 'contracts/abi/stakingRewards.json'

interface UseVaultProps {
  balanceOf: (address: string) => Promise<string>
  vaultAllowance: (ownerAddress: `0x${string}`) => Promise<string>
  approveVault: () => Promise<void>
  stake: (amount: string, senderAddress: string) => Promise<void>
  setLoading: (loading: boolean) => void
  updateBalances: () => Promise<void>
  earned: (ownerAddress: string) => Promise<string>
  withdraw: (amount: string) => Promise<void>
  getReward: () => Promise<void>
  exit: () => Promise<void>
  getTvl: () => Promise<number>
  APR: string
  APRLoading: boolean
  totalSupplyBalance: string
  loading: boolean
}

const yearInSeconds = 31536000

const useVault = (
  vaultAddress?: `0x${string}`,
  tokenAddress?: `0x${string}`,
  token0?: `0x${string}`,
  token1?: `0x${string}`
): UseVaultProps => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()
  const { updateState } = useNewoContext()
  const token = useToken(tokenAddress)
  const [vaultInstance, setVaultInstance] = useState<ethers.Contract | null>(
    null
  )
  const provider = useProvider()

  const [APR, setAPR] = useState('')
  const [APRLoading, setAPRLoading] = useState(false)
  const [totalSupplyBalance, setTotalSupplyBalance] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (vaultAddress) {
      if (provider) {
        const instance = new ethers.Contract(vaultAddress, vaultAbi, provider)

        if (signer) {
          const instanceWithSigner = instance?.connect(signer)
          setVaultInstance(instanceWithSigner)
        } else {
          setVaultInstance(instance)
        }
      }
    }
    // eslint-disable-next-line
  }, [vaultAddress, provider, signer])

  const balanceOf = async (address: string) => {
    // Returns the user vault balance
    try {
      const balance = await vaultInstance?.balanceOf(address)
      const decimals = token?.decimals
      const formattedBalance = ethers.utils.formatUnits(balance, decimals)

      return formattedBalance
    } catch (err) {
      return ''
    }
  }

  const totalSupply = async () => {
    // Returns the vault balance
    try {
      const balance = await vaultInstance?.totalSupply()
      const formattedBalance = ethers.utils.formatUnits(balance, token.decimals)

      setTotalSupplyBalance(formattedBalance)
    } catch (err) {
      return
    }
  }

  const getTvl = async () => {
    let computedTvl = 0

    if (token0 && token1) {
      const token0Instance = new ethers.Contract(token0, erc20ABI, provider)
      const token1Instance = new ethers.Contract(token1, erc20ABI, provider)

      // Get the usd price of token0 and token1 and rewards token
      const token0Price = await getTokenPriceByAddress(token0, chain?.name)
      const token1Price = await getTokenPriceByAddress(token1, chain?.name)

      // Get the balance of the LP contract on token0
      const lpTokenBalance0 = await token0Instance?.balanceOf(tokenAddress)
      const lpTokenBalanceDecimals0 = await token0Instance?.decimals()
      const convertedLpTokenBalance0 = ethers.utils.formatUnits(
        lpTokenBalance0,
        lpTokenBalanceDecimals0
      )

      // Get the balance of the LP contract on token1
      const lpTokenBalance1 = await token1Instance?.balanceOf(tokenAddress)
      const lpTokenBalanceDecimals1 = await token1Instance?.decimals()
      const convertedLpTokenBalance1 = ethers.utils.formatUnits(
        lpTokenBalance1,
        lpTokenBalanceDecimals1
      )

      // Get the total supply of the vault
      const vaultTotalSupply = await vaultInstance?.totalSupply()
      const convertedVaultTotalSupply = ethers.utils.formatUnits(
        vaultTotalSupply,
        'ether'
      )

      // Get the total supply of the lp token
      const tokenTotalSupply = token.totalSupply

      computedTvl =
        ((Number(convertedLpTokenBalance0) * token0Price +
          Number(convertedLpTokenBalance1) * token1Price) *
          Number(convertedVaultTotalSupply)) /
        Number(tokenTotalSupply)
    } else {
      const vaultTotalSupply = await vaultInstance?.totalSupply()
      const vaultDecimals = token?.decimals
      const convertedVaultTotalSupply = ethers.utils.formatUnits(
        vaultTotalSupply,
        vaultDecimals
      )

      computedTvl = Number(convertedVaultTotalSupply) * 0
    }

    return Number(computedTvl)
  }

  const getAPR = async () => {
    let calculatedApr = 0
    setAPRLoading(true)
    if (vaultInstance) {
      const rewardRate = await vaultInstance?.rewardRate()
      const convertedRewardRate = ethers.utils.formatUnits(rewardRate, 'ether')

      if (token0 && token1) {
        const rewardsToken = await vaultInstance?.rewardsToken()

        const rewardTokenPrice = await getTokenPriceByAddress(
          rewardsToken,
          chain?.name
        )

        const lpTvl = await getTvl()

        calculatedApr =
          (Number(convertedRewardRate) *
            rewardTokenPrice *
            yearInSeconds *
            100) /
          lpTvl
      } else {
        const totalVaultSupply = await vaultInstance?.totalSupply()
        const convertedTotalVaultSupply = ethers.utils.formatUnits(
          totalVaultSupply,
          'ether'
        )

        calculatedApr =
          (Number(convertedRewardRate) / Number(convertedTotalVaultSupply)) *
          yearInSeconds *
          100
      }

      const finalApr = calculatedApr.toFixed(2)

      if (Number.isNaN(Number)) {
        return
      }

      setAPR(finalApr)
    }

    setAPRLoading(false)
  }

  const vaultAllowance = async (ownerAddress: `0x${string}`) => {
    let allowance = ''

    if (vaultAddress) {
      allowance = await token.allowance(ownerAddress, vaultAddress)
    }

    return allowance
  }

  const approveVault = async () => {
    // Approves the user's tokens to be used by the vault
    if (vaultAddress) {
      setLoading(true)

      await token.approve(vaultAddress)

      setLoading(false)
    }
  }

  const stake = async (amount: string, senderAddress: string) => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)

    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 'ether')
      const tx = await vaultInstance?.stake(parsedAmount, {
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

  const earned = async (ownerAddress: string) => {
    // Fetches the reward amount of the user that has deposited
    try {
      const earned = await vaultInstance?.earned(ownerAddress)
      const formattedEarnedAmount = ethers.utils.formatUnits(
        earned,
        token.decimals
      )

      return formattedEarnedAmount
    } catch (err) {
      return ''
    }
  }

  const withdraw = async (amount: string) => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)
    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 'ether')
      const tx = await vaultInstance?.withdraw(parsedAmount)
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

  const getReward = async () => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)

    try {
      const tx = await vaultInstance?.getReward()
      const receipt = await tx?.wait()

      if (receipt?.status === 1) {
        toast({
          title: 'Claim Successful',
          description: 'You have successfully claimed your rewards.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('[CLAIM ERROR]', err)
      toast({
        title: 'Claim Failed',
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

  const exit = async () => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)

    try {
      const tx = await vaultInstance?.exit()
      const receipt = await tx?.wait()

      if (receipt?.status === 1) {
        toast({
          title: 'Withdraw and Claim Successful',
          description:
            'You have successfully withdrawn and claimed your rewards.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('[WITHDRAW AND CLAIM ERROR]', err)
      toast({
        title: 'Withdraw and Claim Failed',
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

  const updateBalances = async () => {
    Promise.all([getAPR(), totalSupply()])
  }

  useEffect(() => {
    // Update balances on first load
    if (vaultInstance && tokenAddress && vaultAddress && token.decimals !== 0) {
      updateBalances()
    }

    // eslint-disable-next-line
  }, [vaultInstance, token.decimals, vaultAddress, tokenAddress])

  return {
    balanceOf,
    vaultAllowance,
    approveVault,
    stake,
    setLoading,
    updateBalances,
    earned,
    withdraw,
    getReward,
    exit,
    getTvl,
    APR,
    APRLoading,
    totalSupplyBalance,
    loading,
  }
}

export default useVault
