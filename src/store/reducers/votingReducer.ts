export const GET_TOTAL_VOTING_POWER = 'GET_TOTAL_VOTING_POWER'
export const UPDATE_VOTING_POWER = 'UPDATE_VOTING_POWER'
export const UPDATE_STAKED_TOKENS = 'UPDATE_STAKED_TOKENS'
export const UPDATE_LOADING_STATE = 'UPDATE_LOADING_STATE'
export const UPDATE_VAULT_ALLOWANCE = 'UPDATE_VAULT_ALLOWANCE'
export const UPDATE_TOTAL_VOTING_POWER = 'UPDATE_TOTAL_VOTING_POWER'
export const UPDATE_TOTAL_VOTING_POWER_DENOMINATION =
  'UPDATE_TOTAL_VOTING_POWER_DENOMINATION'

interface VotingStateProps {
  stakedTokens: string
  votingPower: number
  totalVotingPower: number
  loading: boolean
  allowance: string
  votingPowerDenomination: {
    sNEWO: number
    veNEWO: number
    veNEWOa: number
  }
}
interface VotingTypeProps {
  type:
    | 'GET_TOTAL_VOTING_POWER'
    | 'UPDATE_VOTING_POWER'
    | 'UPDATE_STAKED_TOKENS'
    | 'UPDATE_LOADING_STATE'
    | 'UPDATE_VAULT_ALLOWANCE'
    | 'UPDATE_TOTAL_VOTING_POWER'
    | 'UPDATE_TOTAL_VOTING_POWER_DENOMINATION'
  payload: any
}

export const initialVotingState = {
  votingPower: 0,
  totalVotingPower: 0,
  stakedTokens: '',
  allowance: '',
  loading: false,
  votingPowerDenomination: {
    // votingPower()
    sNEWO: 0,
    // balanceOf() eth
    veNEWO: 0,
    // balanceOf() avax
    veNEWOa: 0,
  },
}

export const votingReducer = (
  state: VotingStateProps,
  { type, payload }: VotingTypeProps
) => {
  switch (type) {
    case GET_TOTAL_VOTING_POWER:
      return {
        ...state,
        totalVotingPower: payload,
      }
    case UPDATE_TOTAL_VOTING_POWER:
      return {
        ...state,
        totalVotingPower: payload,
      }
    case UPDATE_TOTAL_VOTING_POWER_DENOMINATION:
      return {
        ...state,
        votingPowerDenomination: payload,
      }
    case UPDATE_VOTING_POWER:
      return {
        ...state,
        votingPower: payload,
      }
    case UPDATE_STAKED_TOKENS:
      return {
        ...state,
        stakedTokens: payload,
      }
    case UPDATE_LOADING_STATE:
      return {
        ...state,
        loading: payload,
      }
    case UPDATE_VAULT_ALLOWANCE: {
      return {
        ...state,
        allowance: payload,
      }
    }
    default:
      return state
  }
}
