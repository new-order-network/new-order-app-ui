import { useCallback, useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { useToast } from '@chakra-ui/react'
import { useAccount, useProvider, useSigner } from 'wagmi'

import useToken from 'hooks/useToken'

import { useNewoContext } from 'store/contexts/newoContext'

import veAirdropRewardAbi from 'contracts/abi/veAirdropReward.json'

interface AirdropInfo {
  index: number
  amount: string
  proof: string[]
}

interface UseVeAirdropProps {
  isEligible: boolean
  airdropInfo: null | AirdropInfo
  airdropAmount: string
  claimableRewards: string
  loading: boolean
  claim: () => void
}

const useVeAirdropReward = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merkleRoot: any,
  tokenAddress?: `0x${string}`,
  merkleDistributorAddress?: `0x${string}`
): UseVeAirdropProps => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const newoContext = useNewoContext()
  const [airdropInstance, setAirdropInstance] =
    useState<ethers.Contract | null>(null)
  const token = useToken(tokenAddress)
  const provider = useProvider()

  const [airdropInfo, setAirdropInfo] = useState<null | AirdropInfo>(null)
  const [claimableRewards, setClaimableRewards] = useState('')
  const [isEligible, setIsEligible] = useState(false)
  const [airdropAmount, setAirdropAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (merkleDistributorAddress) {
      if (provider) {
        const instance = new ethers.Contract(
          merkleDistributorAddress,
          veAirdropRewardAbi,
          provider
        )

        if (signer) {
          const instanceWithSigner = instance?.connect(signer)
          setAirdropInstance(instanceWithSigner)
        } else {
          setAirdropInstance(instance)
        }
      }
    }
    // eslint-disable-next-line
  }, [merkleDistributorAddress, provider, signer])

  const getIsClaimed = async (address: string) => {
    if (airdropInstance && address) {
      const claimable = await airdropInstance?.claimed(address)

      if (claimable && token.decimals !== 0) {
        const amount = BigNumber.from(claimable)
        const formattedAmount = ethers.utils.formatUnits(amount, token.decimals)

        setClaimableRewards(formattedAmount)
      }
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
    if (address) {
      Promise.all([getIsClaimed(address)])
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
          address,
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
    if (airdropInstance && address) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const merkleRootClaims: any = merkleRoot.claims

      const isFound = Object.keys(merkleRootClaims).find((claim) => {
        return address && claim.toLowerCase() === address.toLowerCase()
      })
      if (isFound) {
        setIsEligible(true)

        const airdropDetails = merkleRootClaims[isFound]

        setAirdropInfo(airdropDetails)
        getIsClaimed(address)
        getAmount(airdropDetails.amount)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airdropInstance, address, getAmount])

  return {
    isEligible,
    airdropInfo,
    airdropAmount,
    loading,
    claim,
    claimableRewards,
  }
}

export default useVeAirdropReward
