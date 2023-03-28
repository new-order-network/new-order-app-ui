import {
  useAccount,
  useContract,
  useContractRead,
  useProvider,
  useSigner,
} from 'wagmi'
import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { ethers } from 'ethers'

import veRewardsControllerAbi from 'contracts/abi/veRewardsController.json'

const useVeRewardsController = (rewardsControllerAddress: `0x${string}`) => {
  const veRewardsControllerContract = {
    address: rewardsControllerAddress,
    abi: veRewardsControllerAbi,
  }
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address } = useAccount()

  const { data: declaration } = useContractRead({
    ...veRewardsControllerContract,
    functionName: 'legalDeclaration',
    enabled: rewardsControllerAddress !== '0x',
  })

  const { data: depositUserStatus, refetch: refetchDepositUserStatus } =
    useContractRead({
      ...veRewardsControllerContract,
      functionName: 'depositUserStatus',
      args: [address],
      enabled: Boolean(rewardsControllerAddress !== '0x' && address),
    })

  const veRewardsControllerInstance = useContract({
    ...veRewardsControllerContract,
    signerOrProvider: signer || provider,
  })

  const signDeclaration = async () => {
    try {
      const hashedDeclaration = ethers.utils.solidityKeccak256(
        ['string'],
        [declaration]
      )
      const signedDeclaration = await signer?.signMessage(
        ethers.utils.arrayify(hashedDeclaration)
      )
      return signedDeclaration
    } catch (err) {
      console.error('[SIGNATURE ERROR]', err)
    }
    return ''
  }

  const notifyAllDeposit = async () => {
    setLoading(true)

    try {
      const signedDeclaration = await signDeclaration()
      if (signedDeclaration) {
        const gas =
          await veRewardsControllerInstance?.estimateGas.notifyAllDeposit(
            signedDeclaration
          )
        const tx = await veRewardsControllerInstance?.notifyAllDeposit(
          signedDeclaration,
          { gasLimit: gas }
        )

        const receipt = await tx.wait()

        if (receipt.status === 1) {
          toast({
            title: 'Registration Successful',
            description: 'You have successfully registered for rewards.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
        }
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
      setLoading(false)
      updateState()
    }
  }

  const getAllRewards = async () => {
    setLoading(true)

    try {
      const signedDeclaration = await signDeclaration()
      if (signedDeclaration) {
        const gas =
          await veRewardsControllerInstance?.estimateGas.getAllRewards(
            signedDeclaration
          )
        const tx = await veRewardsControllerInstance?.getAllRewards(
          signedDeclaration,
          {
            gasLimit: gas,
          }
        )

        const receipt = await tx.wait()

        if (receipt.status === 1) {
          toast({
            title: 'Claim Successful',
            description: 'You have successfully claimed your rewards.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
        }
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
      setLoading(false)
    }
  }

  const exitAllRewards = async () => {
    setLoading(true)

    try {
      const signedDeclaration = await signDeclaration()
      if (signedDeclaration) {
        const gas =
          await veRewardsControllerInstance?.estimateGas.exitAllRewards(
            declaration
          )
        const tx = await veRewardsControllerInstance?.exitAllRewards(
          declaration,
          { gasLimit: gas }
        )

        const receipt = await tx.wait()

        if (receipt.status === 1) {
          toast({
            title: 'Claim Successful',
            description: 'You have successfully claimed your rewards.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
        }
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
      setLoading(false)
    }
  }

  const updateState = async () => {
    Promise.all([refetchDepositUserStatus()])
  }

  return {
    loading,
    declaration,
    depositUserStatus,
    notifyAllDeposit,
    getAllRewards,
    exitAllRewards,
    updateState,
  }
}

export default useVeRewardsController
