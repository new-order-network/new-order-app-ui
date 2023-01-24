import { BigNumber, ethers } from 'ethers'
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

interface UseTokenResponse {
  approve: (spenderAddress: `0x${string}`) => Promise<void>
  allowance: (
    ownerAddress: `0x${string}`,
    spenderAddress: `0x${string}`
  ) => Promise<string>
  updateState: () => Promise<void>
  tokenInstance: ethers.Contract | null
  totalSupply: string
  tokenSymbol: string
  decimals: number
  balance: string
}

const useToken = (tokenAddress?: `0x${string}`): UseTokenResponse => {
  const tokenContract = {
    address: tokenAddress,
    abi: erc20ABI,
  }
  const toast = useToast()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address: accountAddress } = useAccount()

  const tokenInstance = useContract({
    ...tokenContract,
    signerOrProvider: signer || provider,
  })

  const { data: decimals } = useContractRead({
    ...tokenContract,
    functionName: 'decimals',
  })

  const { data: tokenSymbol } = useContractRead({
    ...tokenContract,
    functionName: 'symbol',
  })

  const { data: tokenData, refetch: refetchTokenData } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: 'totalSupply',
      },
      {
        ...tokenContract,
        functionName: 'balanceOf',
        // eslint-disable-next-line
        args: [accountAddress!],
      },
    ],
    select: (data) => {
      const results: string[] = []
      for (let i = 0; i < data.length; i++) {
        results[i] = ethers.utils.formatUnits(data[i] as BigNumber, decimals)
      }
      return results
    },
    enabled: !!decimals && !!accountAddress,
    allowFailure: true,
  })

  const approve = async (spenderAddress: `0x${string}`) => {
    try {
      const gas = await tokenInstance?.estimateGas.approve(
        spenderAddress,
        ethers.constants.MaxUint256
      )
      const tx = await tokenInstance?.approve(
        spenderAddress,
        ethers.constants.MaxUint256,
        { gasLimit: gas }
      )
      const receipt = await tx?.wait()
      if (receipt?.status === 1) {
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

  const allowance = async (
    ownerAddress: `0x${string}`,
    spenderAddress: `0x${string}`
  ) => {
    try {
      const allowance = await tokenInstance?.allowance(
        ownerAddress,
        spenderAddress
      )
      const formattedAllowance = ethers.utils.formatUnits(
        allowance as BigNumber,
        decimals
      )
      return formattedAllowance
    } catch (err) {
      return ''
    }
  }

  const updateState = async () => {
    Promise.all([refetchTokenData()])
  }

  return {
    approve,
    allowance,
    updateState,
    tokenInstance,
    totalSupply: tokenData ? tokenData[0] : '0',
    balance: tokenData ? tokenData[1] : '0',
    tokenSymbol: tokenSymbol ? tokenSymbol : '',
    decimals: decimals ? decimals : 0,
  }
}

export default useToken
