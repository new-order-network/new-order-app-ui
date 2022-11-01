import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useAccount, useProvider, useSigner } from 'wagmi'

import useToken from 'hooks/useToken'

import { useNewoContext } from 'store/contexts/newoContext'

import stakingAbi from 'contracts/abi/votingPower.json'

const useGovernanceVault = (
  tokenAddress: string,
  governanceVaultAddress?: string
) => {
  const toast = useToast()
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { updateState: updateNewoState } = useNewoContext()

  const token = useToken(tokenAddress)

  const [governanceVaultInstance, setGovernanceVaultInstance] =
    useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(false)

  const provider = useProvider()

  useEffect(() => {
    if (governanceVaultAddress && provider) {
      const instance = new ethers.Contract(
        governanceVaultAddress,
        stakingAbi,
        provider
      )
      setGovernanceVaultInstance(instance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, governanceVaultAddress])

  useEffect(() => {
    if (signer) {
      const instanceWithSigner = governanceVaultInstance?.connect(signer)
      if (instanceWithSigner) {
        setGovernanceVaultInstance(instanceWithSigner)
      }
    }

    // eslint-disable-next-line
  }, [signer])

  const stake = async (amount: string) => {
    if (!address) {
      return
    }
    setLoading(true)

    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 'ether')
      const tx = await governanceVaultInstance?.stake(parsedAmount, {
        from: address,
      })
      const receipt = await tx?.wait()

      if (receipt?.status === 1) {
        toast({
          title: 'Staking Successful',
          description: 'You have successfully staked your tokens.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (error) {
      console.error('[STAKING ERROR]', error)
      toast({
        title: 'Staking Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    } finally {
      await updateNewoState?.()
      setLoading(false)
    }
  }

  const unstake = async (amount: string) => {
    if (!address) {
      return
    }
    setLoading(true)

    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 'ether')
      const tx = await governanceVaultInstance?.unstake(parsedAmount, {
        from: address,
      })
      const receipt = await tx.wait()

      if (receipt.status === 1) {
        toast({
          title: 'Unstaking Successful',
          description: 'You have successfully unstaked your tokens.',
          isClosable: true,
          position: 'top-right',
          status: 'success',
          variant: 'success',
        })
      }
    } catch (error) {
      console.error('[UNSTAKING ERROR]', error)
      toast({
        title: 'Unstaking Failed',
        description: 'Something went wrong! Please try again later.',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
    } finally {
      await updateNewoState?.()
      setLoading(false)
    }
  }

  const stakes = async (accountAddress: string) => {
    try {
      const stakedTokens = await governanceVaultInstance?.stakes(accountAddress)
      const formattedStakedTokens = ethers.utils.formatUnits(
        stakedTokens,
        'ether'
      )

      return formattedStakedTokens
    } catch (err) {
      return ''
    }
  }

  const approveVault = async () => {
    // Approves the user's tokens to be used by the vault
    if (governanceVaultAddress) {
      setLoading(true)

      await token.approve(governanceVaultAddress)

      setLoading(false)
    }
  }

  const vaultAllowance = async (ownerAddress: string) => {
    let allowance = ''

    if (governanceVaultAddress) {
      allowance = await token.allowance(ownerAddress, governanceVaultAddress)
    }

    return allowance
  }

  return {
    loading,
    stake,
    unstake,
    stakes,
    approveVault,
    vaultAllowance,
  }
}

export default useGovernanceVault
