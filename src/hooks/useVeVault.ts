import { useToast } from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import {
  erc20ABI,
  useAccount,
  useContract,
  useContractRead,
  useContractReads,
  useNetwork,
  useProvider,
  useSigner,
} from 'wagmi'

import useToken from 'hooks/useToken'

import { getTokenPriceByAddress } from 'lib/utils/tokens'
import { getTvl } from 'lib/utils/vault'

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
  balance: string
  vaultAllowance: string
  APR: string
  totalSupplyBalance: string
  loading: boolean
  earned: string
  assetBalance: string
  newoShare: string
  approveVault: () => Promise<void>
  deposit: (amount: string, senderAddress: string) => Promise<void>
  withdraw: (amount: string, receiverAddress: string) => Promise<void>
  getReward: () => Promise<void>
  exit: () => Promise<void>
  notifyDeposit: () => Promise<void>
  accounts: (ownerAddress: string) => Promise<Account | null>
  updateState: () => Promise<void>
}

const useVeVault = (
  vaultAddress?: `0x${string}`,
  tokenAddress?: `0x${string}`,
  token0?: `0x${string}`,
  token1?: `0x${string}`
): UseVeVaultProps => {
  const veVaultContract = {
    address: vaultAddress,
    abi: veVaultAbi,
  }
  const tokenContract = {
    address: tokenAddress,
    abi: erc20ABI,
  }

  // TODO: to be removed
  const { contracts } = useContractContext()
  const toast = useToast()
  const { data: signer } = useSigner()
  const { address: accountAddress } = useAccount()
  const provider = useProvider()
  const { chain } = useNetwork()
  const { updateState: newoUpdateState } = useNewoContext()
  const { totalAssets: veNewoTotalAssets } = useVeNewoContext()
  const token = useToken(tokenAddress)
  const veVaultInstance = useContract({
    ...veVaultContract,
    signerOrProvider: signer || provider,
  })
  const [APR, setAPR] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: earnedData, refetch: refetchEarnedData } = useContractRead({
    ...veVaultContract,
    functionName: 'earned',
    args: [accountAddress],
    select: (data) => {
      if (!data) {
        return '0'
      }
      return ethers.utils.formatUnits(data as BigNumber, token.decimals)
    },
    enabled: !!token.decimals && !!accountAddress,
  })

  const {
    data: veVaultData,
    refetch: refetchVeVaultData,
    isLoading: veVaultDataIsLoading,
  } = useContractReads({
    contracts: [
      {
        ...veVaultContract,
        functionName: 'balanceOf',
        args: [accountAddress],
      },
      {
        ...veVaultContract,
        functionName: 'assetBalanceOf',
        args: [accountAddress],
      },
      {
        ...veVaultContract,
        functionName: 'getNewoShare',
        args: [accountAddress],
      },
      {
        ...veVaultContract,
        functionName: 'totalSupply',
      },
      {
        ...tokenContract,
        functionName: 'allowance',
        // eslint-disable-next-line
        args: [accountAddress!, vaultAddress!],
      },
    ],
    select: (data) => {
      const results: string[] = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i]) {
          results[i] = '0'
        } else {
          results[i] = ethers.utils.formatUnits(
            data[i] as BigNumber,
            token.decimals
          )
        }
      }
      return results
    },
    enabled: !!token.decimals && !!accountAddress && !!token0 && !!token1,
    allowFailure: true,
  })

  const approveVault = async () => {
    // Approves the user's tokens to be used by the vault
    if (vaultAddress) {
      setLoading(true)
      await token.approve(vaultAddress)
      setLoading(false)
    }
  }

  const exit = async () => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)

    try {
      const tx = await veVaultInstance?.exit()
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
      await updateState()
      await newoUpdateState?.()
      setLoading(false)
    }
  }

  const getReward = async () => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)

    try {
      const tx = await veVaultInstance?.getReward()
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
      await updateState()
      await newoUpdateState?.()
      setLoading(false)
    }
  }

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

        const lpTvl = await getTvl(
          token,
          veVaultInstance,
          provider,
          chain,
          tokenAddress,
          token0,
          token1
        )

        calculatedApr =
          (Number(convertedRewardRate) *
            rewardTokenPrice *
            YEAR_IN_SECONDS *
            100) /
          lpTvl

        // TODO: to be removed
        // NOTE; forces the apr to be 0 when it's the avax lp vault
        if (
          vaultAddress === contracts.VE_NEWO_WAVAX_LP_VAULT ||
          vaultAddress === contracts.VE_NEWO_USDC_LP_VAULT
        ) {
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

  const deposit = async (amount: string, senderAddress: string) => {
    if (!vaultAddress) {
      return
    }
    setLoading(true)

    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 'ether')
      const gas = await veVaultInstance?.estimateGas.deposit(
        parsedAmount,
        senderAddress
      )
      const tx = await veVaultInstance?.deposit(parsedAmount, senderAddress, {
        from: senderAddress,
        gasLimit: gas,
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
      await updateState()
      await newoUpdateState?.()
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
      const gas = await veVaultInstance?.estimateGas.withdraw(
        parsedAmount,
        receiverAddress,
        receiverAddress
      )
      const tx = await veVaultInstance?.withdraw(
        parsedAmount,
        receiverAddress,
        receiverAddress,
        {
          from: receiverAddress,
          gasLimit: gas,
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
      await updateState()
      await newoUpdateState?.()
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
      updateState()
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
      const gas = await veVaultInstance?.estimateGas.notifyDeposit()
      const tx = await veVaultInstance?.notifyDeposit({ gasLimit: gas })
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
      await updateState()
      await newoUpdateState?.()
      setLoading(false)
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

  const updateState = async () => {
    Promise.all([refetchVeVaultData(), refetchEarnedData()])
  }

  return {
    balance: veVaultData ? veVaultData[0] : '0',
    assetBalance: veVaultData ? veVaultData[1] : '0',
    earned: earnedData ? earnedData : '0',
    newoShare: veVaultData ? veVaultData[2] : '0',
    totalSupplyBalance: veVaultData ? veVaultData[3] : '0',
    vaultAllowance: veVaultData ? veVaultData[4] : '0',
    APR,
    loading: loading || veVaultDataIsLoading,
    approveVault,
    deposit,
    withdraw,
    getReward,
    exit,
    notifyDeposit,
    accounts,
    updateState,
  }
}

export default useVeVault
