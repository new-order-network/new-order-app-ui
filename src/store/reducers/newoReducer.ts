export const UPDATE_NEWO_BALANCE = 'UPDATE_NEWO_BALANCE'
export const DISCONNECT_WALLET = 'DISCONNECT_WALLET'
export const UPDATE_METAMASK_STATUS = 'UPDATE_METAMASK_STATUS'

interface NewoStateProps {
  newoBalance: string
  metamaskIsInstalled: boolean
}
interface NewoTypeProps {
  type: 'UPDATE_NEWO_BALANCE' | 'DISCONNECT_WALLET' | 'UPDATE_METAMASK_STATUS'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

export const initialNewoState = {
  newoBalance: '0.0',
  metamaskIsInstalled: false,
}

export const newoReducer = (
  state: NewoStateProps,
  { type, payload }: NewoTypeProps
) => {
  switch (type) {
    case UPDATE_NEWO_BALANCE:
      return {
        ...state,
        newoBalance: payload,
      }
    case DISCONNECT_WALLET:
      return {
        ...state,
        newoBalance: null,
      }
    case UPDATE_METAMASK_STATUS:
      return {
        ...state,
        metamaskIsInstalled: payload,
      }
    default:
      return state
  }
}
