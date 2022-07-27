import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { erc20ABI, useProvider, useSigner } from 'wagmi'
import { useToast } from '@chakra-ui/react'

interface UseTokenResponse {
  tokenInstance: ethers.Contract | null
  balanceOf: (address: string) => Promise<string>
  approve: (spenderAddress: string) => Promise<void>
  totalSupply: () => Promise<string>
  allowance: (ownerAddress: string, spenderAddress: string) => Promise<string>
  tokenSymbol: string
  decimals: number
}

const useToken = (tokenAddress?: string): UseTokenResponse => {
  const toast = useToast()
  const [tokenInstance, setTokenInstance] = useState<ethers.Contract | null>(
    null
  )
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [decimals, setDecimals] = useState(0)

  const provider = useProvider()
  const { data: signer } = useSigner()

  useEffect(() => {
    if (tokenAddress && provider) {
      const instance = new ethers.Contract(tokenAddress, erc20ABI, provider)
      setTokenInstance(instance)
    }
  }, [provider, tokenAddress])

  useEffect(() => {
    if (signer) {
      const instanceWithSigner = tokenInstance?.connect(signer)
      if (instanceWithSigner) {
        setTokenInstance(instanceWithSigner)
      }
    }
    // eslint-disable-next-line
  }, [signer])

  const balanceOf = async (address: string) => {
    try {
      const balance = await tokenInstance?.balanceOf(address)
      const decimals = await tokenInstance?.decimals()
      const formattedBalance = ethers.utils.formatUnits(balance, decimals)

      return formattedBalance
    } catch (err) {
      return ''
    }
  }

  const approve = async (spenderAddress: string) => {
    try {
      const tx = await tokenInstance?.approve(
        spenderAddress,
        ethers.constants.MaxUint256
      )
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        toast({
          title: 'Approval Successful',
          description: 'You have successfully approved the use of your token.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (err) {
      console.error('[APPROVAL ERROR]', err)
      toast({
        title: 'Approval Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    }
  }

  const allowance = async (ownerAddress: string, spenderAddress: string) => {
    try {
      const allowance = await tokenInstance?.allowance(
        ownerAddress,
        spenderAddress
      )
      const decimals = await tokenInstance?.decimals()
      const formattedAllowance = ethers.utils.formatUnits(allowance, decimals)

      return formattedAllowance
    } catch (err) {
      return ''
    }
  }

  const updateTokenSymbol = async () => {
    try {
      const symbol = await tokenInstance?.symbol()
      setTokenSymbol(symbol)
    } catch (err) {
      return
    }
  }

  const updateDecimals = async () => {
    try {
      const decimals = await tokenInstance?.decimals()
      setDecimals(decimals)
    } catch (err) {
      return
    }
  }

  const totalSupply = async () => {
    try {
      const totalSupply = await tokenInstance?.totalSupply()
      const decimals = await tokenInstance?.decimals()

      const formattedTotalSupply = ethers.utils.formatUnits(
        totalSupply,
        decimals
      )

      return formattedTotalSupply
    } catch (err) {
      return ''
    }
  }

  useEffect(() => {
    if (tokenInstance) {
      updateTokenSymbol(), updateDecimals()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenInstance])

  return {
    tokenInstance,
    balanceOf,
    approve,
    allowance,
    totalSupply,
    tokenSymbol,
    decimals,
  }
}

export default useToken
