import { useCallback, useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { useToast } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner } from 'wagmi'

import useToken from 'hooks/useToken'

import { useNewoContext } from 'store/contexts/newoContext'

import merkleDistributorAbi from 'contracts/abi/merkleDistributor.json'

interface AirdropInfo {
  index: number
  amount: string
  proof: string[]
}

interface UseAirdropProps {
  isClaimed: boolean
  isEligible: boolean
  airdropInfo: null | AirdropInfo
  airdropAmount: string
  loading: boolean
  claim: () => void
}

const useAirdrop = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merkleRoot: any,
  tokenAddress?: string,
  merkleDistributorAddress?: string
): UseAirdropProps => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const accountData = useAccount()
  const newoContext = useNewoContext()
  const [airdropInstance, setAirdropInstance] =
    useState<ethers.Contract | null>(null)
  const token = useToken(tokenAddress)
  const provider = useProvider()

  const [airdropInfo, setAirdropInfo] = useState<null | AirdropInfo>(null)
  const [isClaimed, setIsClaimed] = useState(false)
  const [isEligible, setIsEligible] = useState(false)
  const [airdropAmount, setAirdropAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (merkleDistributorAddress && provider) {
      const instance = new ethers.Contract(
        merkleDistributorAddress,
        merkleDistributorAbi,
        provider
      )
      setAirdropInstance(instance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, merkleDistributorAddress])

  useEffect(() => {
    if (signer) {
      const instanceWithSigner = airdropInstance?.connect(signer)
      if (instanceWithSigner) {
        setAirdropInstance(instanceWithSigner)
      }
    }

    // eslint-disable-next-line
  }, [signer])

  const getIsClaimed = async (index: number) => {
    if (airdropInstance) {
      const claimStatus = await airdropInstance?.isClaimed(index)
      setIsClaimed(claimStatus)
    }
  }

  const getAmount = useCallback(
    async (hexAmount: string) => {
      if (hexAmount && token.decimals !== 0) {
        const amount = BigNumber.from(hexAmount)
        const formattedAmount = ethers.utils.formatUnits(amount, token.decimals)
        setAirdropAmount(formattedAmount)
      }
    },
    [token.decimals]
  )

  const updateState = async () => {
    if (airdropInfo) {
      Promise.all([getIsClaimed(airdropInfo?.index)])
    }
  }

  const claim = async () => {
    setLoading(true)

    if (airdropInstance && airdropInfo) {
      try {
        const { index, amount: hexAmount, proof } = airdropInfo

        const decAmount = BigNumber.from(hexAmount)

        const tx = await airdropInstance?.claim(
          index,
          accountData?.address,
          decAmount,
          proof
        )
        const receipt = await tx.wait()
        if (receipt.status === 1) {
          toast({
            title: 'Claim Successful',
            description: 'You have successfully claimed your airdrop.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
        }
      } catch (error) {
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
        await newoContext?.updateState?.()
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (airdropInstance && accountData?.address) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const merkleRootClaims: any = merkleRoot.claims

      const isFound = Object.keys(merkleRootClaims).find((claim) => {
        return (
          accountData.address &&
          claim.toLowerCase() === accountData?.address.toLowerCase()
        )
      })
      if (isFound) {
        setIsEligible(true)

        const airdropDetails = merkleRootClaims[isFound]

        setAirdropInfo(airdropDetails)
        getIsClaimed(airdropDetails.index)
        getAmount(airdropDetails.amount)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airdropInstance, accountData, getAmount])

  return {
    isClaimed,
    isEligible,
    airdropInfo,
    airdropAmount,
    loading,
    claim,
  }
}

export default useAirdrop
