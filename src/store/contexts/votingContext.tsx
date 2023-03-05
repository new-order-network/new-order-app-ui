import { createContext, useContext, useEffect, useReducer } from 'react'
import { useAccount } from 'wagmi'
import snapshot from '@snapshot-labs/snapshot.js'

import useGovernanceVault from 'hooks/useGovernanceVault'

import { env } from 'lib/environment'

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

import { DEFAULT_NETWORK } from 'constants/network'
import { snapshotStrategies } from 'constants/voting'

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
    let totalVotingPower = 0
    const totalVotingPowerDenomination: { [key: string]: number } = {}

    const votingPower = await snapshot.utils.getVp(
      String(accountAddress),
      `${DEFAULT_NETWORK.id}`,
      snapshotStrategies,
      'latest',
      env.NEXT_PUBLIC_SNAPSHOT_SPACE,
      true
    )

    if (votingPower) {
      totalVotingPower = votingPower.vp
    }

    votingPower.vp_by_strategy.forEach((vpStrategy: number, index: number) => {
      const currentStrategy = snapshotStrategies[index]
      totalVotingPowerDenomination[currentStrategy.params.symbol] = vpStrategy
    })

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
