import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import {
  erc20ABI,
  useAccount,
  useContract,
  useContractRead,
  useContractReads,
  useProvider,
  useSigner,
} from 'wagmi'
import { useToast } from '@chakra-ui/react'
import dayjs from 'dayjs'

import useToken from 'hooks/useToken'

import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useNewoContext } from 'store/contexts/newoContext'

import veTokenAbi from 'contracts/abi/veToken.json'

// veTokenAddress - address of the veToken
// tokenAddress - address of token to get veToken
const useVeToken = (
  veTokenAddress: `0x${string}`,
  tokenAddress: `0x${string}`
) => {
  const veTokenContract = {
    address: veTokenAddress,
    abi: veTokenAbi,
  }
  const tokenContract = {
    address: tokenAddress,
    abi: erc20ABI,
  }
  const toast = useToast()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { updateState: updateVeNewoState } = useVeNewoContext()
  const { updateState: updateNewoState } = useNewoContext()
  const { address: accountAddress } = useAccount()
  const [loading, setLoading] = useState(false)
  const token = useToken(tokenAddress)

  const { data: decimals, refetch: refetchDecimals } = useContractRead({
    ...veTokenContract,
    functionName: 'decimals',
  })

  const { data: unlockDate, refetch: refetchUnlockDate } = useContractRead({
    ...veTokenContract,
    functionName: 'unlockDate',
    select: (data) => {
      const unlockDateNumber = (data as BigNumber).toNumber()
      return unlockDateNumber
    },
    args: [accountAddress],
  })

  const { data: multiplier, refetch: refetchMultiplier } = useContractRead({
    ...veTokenContract,
    functionName: 'veMult',
    select: (data) => {
      const veMultNumber = (data as BigNumber).toNumber()
      const veMultiplier = veMultNumber / 100
      if (Number.isNaN(veMultiplier)) {
        return 0
      }
      return veMultiplier
    },
    args: [accountAddress],
  })

  const { data: veTokenData, refetch: refetchVeTokenData } = useContractReads({
    contracts: [
      {
        ...veTokenContract,
        functionName: 'totalSupply',
      },
      {
        ...veTokenContract,
        functionName: 'totalAssets',
      },
      {
        ...veTokenContract,
        functionName: 'balanceOf',
        args: [accountAddress],
      },
      {
        ...veTokenContract,
        functionName: 'assetBalanceOf',
        args: [accountAddress],
      },
      {
        ...tokenContract,
        functionName: 'allowance',
        // eslint-disable-next-line
        args: [accountAddress!, veTokenAddress],
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
            decimals as BigNumber
          )
        }
      }
      return results
    },
    enabled: !!decimals && !!accountAddress,
    allowFailure: true,
  })

  const veTokenInstance = useContract({
    ...veTokenContract,
    signerOrProvider: signer || provider,
  })

  useEffect(() => {
    updateState()
    // eslint-disable-next-line
  }, [veTokenAddress, tokenAddress, accountAddress])

  const updateState = async () => {
    Promise.all([
      refetchMultiplier(),
      refetchVeTokenData(),
      refetchDecimals(),
      refetchUnlockDate(),
    ])
  }

  const approveVeToken = async () => {
    setLoading(true)
    await token.approve(veTokenAddress)
    setLoading(false)
  }

  const deposit = async (
    amount: string,
    receiverAddress: string,
    lockTime: Date
  ) => {
    setLoading(true)

    try {
      const parsedAmount = ethers.utils.parseUnits(
        amount,
        decimals as BigNumber
      )
      const duration = dayjs().diff(dayjs(lockTime), 's')

      const gas = await veTokenInstance?.estimateGas?.[
        'deposit(uint256,address,uint256)'
      ](parsedAmount, receiverAddress, Math.abs(duration))

      const tx = await veTokenInstance?.['deposit(uint256,address,uint256)'](
        parsedAmount,
        receiverAddress,
        Math.abs(duration),
        { gasLimit: gas }
      )

      const receipt = await tx.wait()

      if (receipt.status === 1) {
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
      await updateVeNewoState?.()
      await updateNewoState?.()
      setLoading(false)
    }
  }

  const exit = async () => {
    setLoading(true)

    try {
      const gas = await veTokenInstance?.estimateGas?.exit()
      const tx = await veTokenInstance?.exit({ gasLimit: gas })
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        toast({
          title: 'Withdraw Successful',
          description: 'You have successfully withdrew your tokens.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('[EXIT ERROR]', err)
      toast({
        title: 'Withdraw Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    } finally {
      await updateVeNewoState?.()
      await updateNewoState?.()
      setLoading(false)
    }
  }

  return {
    approveVeToken,
    deposit,
    exit,
    loading,
    veTokenInstance,
    totalSupply: veTokenData ? veTokenData[0] : '0',
    totalAssets: veTokenData ? veTokenData[1] : '0',
    balance: veTokenData ? veTokenData[2] : '0',
    assetBalance: veTokenData ? veTokenData[3] : '0',
    allowance: veTokenData ? veTokenData[4] : '0',
    multiplier,
    unlockDate,
    decimals,
    updateState,
  }
}

export default useVeToken
