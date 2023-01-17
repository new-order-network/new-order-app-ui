import { createContext, useContext, useEffect, useReducer } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'

import useGovernanceVault from 'hooks/useGovernanceVault'

import { useContractContext } from 'store/contexts/contractContext'
import {
  initialVotingState,
  UPDATE_STAKED_TOKENS,
  UPDATE_TOTAL_VOTING_POWER,
  UPDATE_TOTAL_VOTING_POWER_DENOMINATION,
  UPDATE_VAULT_ALLOWANCE,
  // UPDATE_VOTING_POWER,
  votingReducer,
} from 'store/reducers/votingReducer'

import { contractAddresses } from 'constants/contractAddresses'
import { SUPPORTED_NETWORKS } from 'constants/network'

import stakingAbi from 'contracts/abi/votingPower.json'
import veTokenAbi from 'contracts/abi/veToken.json'

interface VotingProviderProps {
  children: React.ReactNode
}

export interface VotingStateProps {
  stakedTokens: string
  allowance: string
  votingPower: number
  totalVotingPower: number
  loading: boolean
  votingPowerDenomination: {
    sNEWO: number
    veNEWO: number
    veNEWOa: number
  }
  updateState?: () => Promise<void>
}

export const VotingContext = createContext<VotingStateProps>({
  stakedTokens: '',
  allowance: '',
  votingPower: 0,
  totalVotingPower: 0,
  loading: false,
  votingPowerDenomination: {
    sNEWO: 0,
    veNEWO: 0,
    veNEWOa: 0,
  },
})

export const VotingProvider: React.FC<VotingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(votingReducer, initialVotingState)
  const { contracts } = useContractContext()
  const { address: accountAddress } = useAccount()
  const governanceVault = useGovernanceVault(
    contracts?.NEWO,
    contracts?.GOVERNANCE_VAULT
  )

  const updateStakedTokens = async () => {
    if (accountAddress) {
      const stakedTokens = await governanceVault.stakes(accountAddress)
      dispatch({ type: UPDATE_STAKED_TOKENS, payload: stakedTokens })
    }
  }

  const updateAllowance = async () => {
    if (accountAddress) {
      const vaultAllowance = await governanceVault.vaultAllowance(
        accountAddress
      )

      dispatch({ type: UPDATE_VAULT_ALLOWANCE, payload: vaultAllowance })
    }
  }

  const getTotalVotingPower = async () => {
    const networks = SUPPORTED_NETWORKS.filter((network) => {
      return !network.testnet && network
    })

    let totalVotingPower = 0
    let totalVotingPowerDenomination = {
      sNEWO: 0,
      veNEWO: 0,
      veNEWOa: 0,
    }

    for (let index = 0; index < networks.length; index++) {
      const provider = new ethers.providers.JsonRpcProvider(
        networks[index].rpcUrls.default
      )

      // VOTING POWER
      const governanceVaultAddress =
        contractAddresses[networks[index].id].GOVERNANCE_VAULT

      if (governanceVaultAddress) {
        const governanceVaultInstance = new ethers.Contract(
          governanceVaultAddress,
          stakingAbi,
          provider
        )

        const votingPower = await governanceVaultInstance?.votingPower(
          accountAddress
        )

        const formattedVotingPower = ethers.utils.formatUnits(
          votingPower,
          'ether'
        )

        console.log('votingPower formattedVotingPower', formattedVotingPower)
        totalVotingPower += Number(formattedVotingPower)
        totalVotingPowerDenomination = {
          ...state.votingPowerDenomination,
          sNEWO: Number(formattedVotingPower),
        }
      }

      // VENEWO
      const veNewoAddress = contractAddresses[networks[index].id].VENEWO
      const veNewoInstance = new ethers.Contract(
        veNewoAddress,
        veTokenAbi,
        provider
      )
      const decimals = await veNewoInstance.decimals()
      const balanceOf = await veNewoInstance.balanceOf(accountAddress)
      const formattedBalanceOf = ethers.utils.formatUnits(balanceOf, decimals)
      console.log('formattedBalanceOf', formattedBalanceOf)

      totalVotingPower += Number(formattedBalanceOf)

      if (networks[index].id === 1) {
        totalVotingPowerDenomination = {
          ...state.votingPowerDenomination,
          veNEWO: Number(formattedBalanceOf),
        }
      } else if (networks[index].id === 43114) {
        totalVotingPowerDenomination = {
          ...state.votingPowerDenomination,
          veNEWOa: Number(formattedBalanceOf),
        }
      }
    }

    dispatch({
      type: UPDATE_TOTAL_VOTING_POWER,
      payload: totalVotingPower,
    })
    dispatch({
      type: UPDATE_TOTAL_VOTING_POWER_DENOMINATION,
      payload: totalVotingPowerDenomination,
    })
  }

  const updateState = async () => {
    // Updates necessary balances or data that might change when tx is ran
    Promise.all([
      updateStakedTokens(),
      getTotalVotingPower(),
      updateAllowance(),
    ])
  }

  useEffect(() => {
    if (accountAddress) {
      updateState()
    }
    // eslint-disable-next-line
  }, [accountAddress, contracts])

  return (
    <VotingContext.Provider value={{ ...state, updateState }}>
      {children}
    </VotingContext.Provider>
  )
}

export const useVotingContext = () => {
  return useContext(VotingContext)
}
