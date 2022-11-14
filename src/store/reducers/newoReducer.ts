export enum NewoChangeType {
  UPDATE_NEWO_BALANCE = 'UPDATE_NEWO_BALANCE',
  DISCONNECT_WALLET = 'DISCONNECT_WALLET',
  UPDATE_METAMASK_STATUS = 'UPDATE_METAMASK_STATUS',
  UPDATE_ACCOUNT_ADDRESS = 'UPDATE_ACCOUNT_ADDRESS',
}

interface NewoStateProps {
  newoBalance: string
  metamaskIsInstalled: boolean
  accountAddress: string
}
interface NewoTypeProps {
  type:
    | 'UPDATE_NEWO_BALANCE'
    | 'DISCONNECT_WALLET'
    | 'UPDATE_METAMASK_STATUS'
    | 'UPDATE_ACCOUNT_ADDRESS'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

export const initialNewoState = {
  newoBalance: '0.0',
  metamaskIsInstalled: false,
  accountAddress: '',
}

export const newoReducer = (
  state: NewoStateProps,
  { type, payload }: NewoTypeProps
) => {
  switch (type) {
    case NewoChangeType.UPDATE_NEWO_BALANCE:
      return {
        ...state,
        newoBalance: payload,
      }
    case NewoChangeType.DISCONNECT_WALLET:
      return {
        ...state,
        newoBalance: null,
      }
    case NewoChangeType.UPDATE_METAMASK_STATUS:
      return {
        ...state,
        metamaskIsInstalled: payload,
      }
    case NewoChangeType.UPDATE_ACCOUNT_ADDRESS:
      return {
        ...state,
        accountAddress: payload,
      }
    default:
      return state
  }
}
