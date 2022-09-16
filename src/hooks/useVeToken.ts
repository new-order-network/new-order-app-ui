import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useProvider, useSigner } from 'wagmi'
import { useToast } from '@chakra-ui/react'
import dayjs from 'dayjs'

import useToken from 'hooks/useToken'

import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useNewoContext } from 'store/contexts/newoContext'

import veTokenAbi from 'contracts/abi/veToken.json'

// veTokenAddress - address of the veToken
// tokenAddress - address of token to get veToken
const useVeToken = (veTokenAddress: string, tokenAddress: string) => {
  const toast = useToast()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { updateState: updateVeNewoState } = useVeNewoContext()
  const { updateState: updateNewoState } = useNewoContext()

  const [veTokenInstance, setVeTokenInstance] =
    useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(false)
  const token = useToken(tokenAddress)

  useEffect(() => {
    if (veTokenAddress && provider) {
      const instance = new ethers.Contract(veTokenAddress, veTokenAbi, provider)
      setVeTokenInstance(instance)
    }
  }, [veTokenAddress, provider])

  useEffect(() => {
    if (signer) {
      const instanceWithSigner = veTokenInstance?.connect(signer)
      if (instanceWithSigner) {
        setVeTokenInstance(instanceWithSigner)
      }
    }
    // eslint-disable-next-line
  }, [signer])

  const totalSupply = async () => {
    try {
      const totalSupply = await veTokenInstance?.totalSupply()
      const decimals = await veTokenInstance?.decimals()
      const formattedTotalSupply = ethers.utils.formatUnits(
        totalSupply,
        decimals
      )
      return formattedTotalSupply
    } catch (err) {
      return ''
    }
  }

  const totalAssets = async () => {
    try {
      const totalAssets = await veTokenInstance?.totalAssets()
      const decimals = await veTokenInstance?.decimals()
      const formattedTotalAssets = ethers.utils.formatUnits(
        totalAssets,
        decimals
      )
      return formattedTotalAssets
    } catch (err) {
      return ''
    }
  }

  const approveVeToken = async () => {
    setLoading(true)
    await token.approve(veTokenAddress)
    setLoading(false)
  }

  const balanceOf = async (ownerAddress: string) => {
    try {
      const balanceOf = await veTokenInstance?.balanceOf(ownerAddress)
      const decimals = await veTokenInstance?.decimals()
      const formattedBalanceOf = ethers.utils.formatUnits(balanceOf, decimals)
      return formattedBalanceOf
    } catch (err) {
      return ''
    }
  }

  const assetBalanceOf = async (ownerAddress: string) => {
    try {
      const assetBalanceOf = await veTokenInstance?.assetBalanceOf(ownerAddress)
      const decimals = await veTokenInstance?.decimals()
      const formattedAssetBalanceOf = ethers.utils.formatUnits(
        assetBalanceOf,
        decimals
      )
      return formattedAssetBalanceOf
    } catch (err) {
      return ''
    }
  }

  const veTokenAllowance = async (ownerAddress: string) => {
    const allowance = await token.allowance(ownerAddress, veTokenAddress)
    return allowance
  }

  const unlockDate = async (ownerAddress: string) => {
    try {
      const unlockDate = await veTokenInstance?.unlockDate(ownerAddress)
      return unlockDate.toNumber()
    } catch (err) {
      return 0
    }
  }

  const deposit = async (
    amount: string,
    receiverAddress: string,
    lockTime: Date
  ) => {
    setLoading(true)

    try {
      const decimals = await veTokenInstance?.decimals()
      const parsedAmount = ethers.utils.parseUnits(amount, decimals)

      const duration = dayjs().diff(dayjs(lockTime), 's')
      const tx = await veTokenInstance?.['deposit(uint256,address,uint256)'](
        parsedAmount,
        receiverAddress,
        Math.abs(duration)
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
      const tx = await veTokenInstance?.exit()
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
    veTokenAllowance,
    unlockDate,
    deposit,
    totalSupply,
    totalAssets,
    balanceOf,
    assetBalanceOf,
    exit,
    loading,
    veTokenInstance,
  }
}

export default useVeToken
