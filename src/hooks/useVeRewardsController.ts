import { useContract, useContractRead, useProvider, useSigner } from 'wagmi'
import { useToast } from '@chakra-ui/react'
import { useState } from 'react'

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

  const { data: declaration } = useContractRead({
    ...veRewardsControllerContract,
    functionName: 'legalDeclaration',
    enabled: rewardsControllerAddress !== '0x',
  })

  const veRewardsControllerInstance = useContract({
    ...veRewardsControllerContract,
    signerOrProvider: signer || provider,
  })

  const notifyAllDeposit = async () => {
    setLoading(true)

    try {
      const gas =
        await veRewardsControllerInstance?.estimateGas.notifyAllDeposit(
          declaration
        )
      const tx = await veRewardsControllerInstance?.notifyAllDeposit(
        declaration,
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
    }
  }

  const getAllRewards = async () => {
    setLoading(true)

    try {
      const gas = await veRewardsControllerInstance?.estimateGas.getAllRewards(
        declaration
      )
      const tx = await veRewardsControllerInstance?.getAllRewards(declaration, {
        gasLimit: gas,
      })

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
      const gas = await veRewardsControllerInstance?.estimateGas.exitAllRewards(
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

  return {
    loading,
    declaration,
    notifyAllDeposit,
    getAllRewards,
    exitAllRewards,
  }
}

export default useVeRewardsController
