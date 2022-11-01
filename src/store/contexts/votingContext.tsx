import { createContext, useContext, useEffect, useReducer } from 'react'
import { useAccount } from 'wagmi'

import useGovernanceVault from 'hooks/useGovernanceVault'

import { useContractContext } from 'store/contexts/contractContext'
import {
  initialVotingState,
  UPDATE_STAKED_TOKENS,
  UPDATE_VAULT_ALLOWANCE,
  // UPDATE_VOTING_POWER,
  votingReducer,
} from 'store/reducers/votingReducer'

interface VotingProviderProps {
  children: React.ReactNode
}

export interface VotingStateProps {
  stakedTokens: string
  allowance: string
  votingPower: number
  totalVotingPower: number
  loading: boolean
  updateState?: () => Promise<void>
}

export const VotingContext = createContext<VotingStateProps>({
  stakedTokens: '',
  allowance: '',
  votingPower: 0,
  totalVotingPower: 0,
  loading: false,
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
    // TODO
    // dispatch({
    //   type: UPDATE_VOTING_POWER,
    //   payload: governanceVault?.stakedTokens,
    // })
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
